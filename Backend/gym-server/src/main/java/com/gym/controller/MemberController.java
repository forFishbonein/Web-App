package com.gym.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.*;
import com.gym.entity.User;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.result.RestResult;
import com.gym.service.*;
import com.gym.util.SecurityUtils;
import com.gym.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/member")
@Slf4j
@PreAuthorize("hasRole('member')")
public class MemberController {

    @Autowired
    private UserService userService;

    @Autowired
    private TrainerProfileService trainerProfileService;

    @Autowired
    private TrainerConnectRequestService trainerConnectRequestService;

    @Autowired
    private TrainerAvailabilityService trainerAvailabilityService;

    @Autowired
    private AppointmentBookingService appointmentBookingService;

    // Paginate query of trainer list
    // This is in MemberController and requires 'member' role to view
    @GetMapping("/listTrainers")
    public RestResult<?> listTrainers(TrainerProfileQuery query) {
        Page<TrainerProfileVO> resultPage = trainerProfileService.listTrainers(query);
        return RestResult.success(resultPage, "Trainer list retrieved successfully.");
    }

    // Member views their own basic information
    @GetMapping("/user-profile")
    public RestResult<?> getUserProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        // Query the User table record based on current user ID
        User user = userService.getById(currentUserId);
        if (user == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "User not found.");
        }

        // VO class: convert User object to UserProfileResponse object
        UserProfileResponse response = UserProfileResponse.builder()
                .name(user.getName())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .email(user.getEmail())
                .address(user.getAddress())
                .role(user.getRole())
                .isGoogle(user.getPasswordHash() == null)
                .build();
        return RestResult.success(response, "User profile retrieved successfully.");
    }

    // Endpoint to submit a new connect request
    @PostMapping("/connect-trainer")
    public RestResult<?> connectTrainer(@RequestBody @Valid TrainerConnectRequestDTO requestDTO) {
        // Get current user ID
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        // Check if current member has more than 5 pending requests
        int pendingCount = trainerConnectRequestService.countPendingRequests(currentUserId);
        if (pendingCount >= 5) {
            throw new CustomException(ErrorCode.TRAINER_REQUEST_LIMIT, "You have reached the maximum number of pending requests.");
        }
        // Submit request with status Pending
        trainerConnectRequestService.submitConnectRequest(requestDTO, currentUserId);
        return RestResult.success(null, "Connect request submitted successfully.");
    }

    /**
     * Endpoint for user to query future availability slots of a specified trainer
     * The frontend needs to pass the trainer's ID; this endpoint only returns slots with status Available and start time after now
     */
    @GetMapping("/trainer/{trainerId}/availability")
    public RestResult<?> getTrainerAvailability(@PathVariable("trainerId") Long trainerId) {
        // Validate that the current user (member) is logged in
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }

        // Call service layer to fetch available slots for the specified trainer starting from now with status Available
        List<AvailabilitySlotDTO> slotList = trainerAvailabilityService.getAvailableSlots(trainerId);

        // Wrap in TrainerAvailabilityDTO
        TrainerAvailabilityDTO responseDTO = TrainerAvailabilityDTO.builder()
                .availabilitySlots(slotList)
                .build();

        return RestResult.success(responseDTO, "Trainer availability retrieved successfully.");
    }

    // Member selects trainer's available slot and submits a booking request
    @PostMapping("/appointment")
    public RestResult<?> bookAppointment(@RequestBody @Valid AppointmentBookingDTO dto) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        appointmentBookingService.bookSession(dto, currentUserId);
        return RestResult.success(null, "Appointment booking submitted successfully.");
    }

    /**
     * Paginate query for all upcoming bookings of current member:
     * Automatically update expired (or completed) records first, then return only records with status Pending and Approved.
     */
//    The core idea of this design is: before member queries booking records, batch update statuses of all pending records
//    (e.g., update records whose time has passed but still Pending to Expired, or Approved but session ended to Completed), then paginate.
    @GetMapping("/appointments/upcoming")
    public RestResult<?> getUpcomingAppointments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize, String status) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        Page<AppointmentBookingDetailVO> appointmentPage = new Page<>(page, pageSize);
        appointmentPage = appointmentBookingService.getUpcomingAppointmentsForMember(currentUserId, appointmentPage, status);
        return RestResult.success(appointmentPage, "Upcoming appointments retrieved successfully.");
    }

    /**
     * Paginate query for historical bookings of current member:
     * Returns records with status not Pending or Approved (e.g., Expired, Rejected, Cancelled, Completed).
     */
    @GetMapping("/appointments/history")
    public RestResult<?> getHistoricalAppointments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize, String status) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        Page<AppointmentBookingHistoryDetailVO> appointmentPage = new Page<>(page, pageSize);
        appointmentPage = appointmentBookingService.getHistoricalAppointmentsForMember(currentUserId, appointmentPage, status);
        return RestResult.success(appointmentPage, "Historical appointments retrieved successfully.");
    }

    /**
     * Endpoint for member to cancel an appointment
     * Member can cancel their own appointment if status is Pending; if appointment is Approved, user is informed they cannot cancel directly
     * Appointment ID is passed via URL path
     */
    @PutMapping("/appointment/cancel/{appointmentId}")
    public RestResult<?> cancelAppointment(@PathVariable("appointmentId") Long appointmentId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        appointmentBookingService.cancelAppointment(appointmentId, currentUserId);
        return RestResult.success(null, "Appointment cancelled successfully.");
    }

    /**
     * Dynamic statistics endpoint: query booking statistics for current member in specified date range,
     * returning hours of sessions completed each day (in hours).
     * For frontend chart display; date range should not exceed 30 days.
     * Each data point represents 30 minutes.
     *
     * @param startDate Start date for statistics (format yyyy-MM-dd)
     * @param endDate   End date for statistics (format yyyy-MM-dd)
     */
    @GetMapping("/appointments/statistics/dynamic")
    public RestResult<?> getDynamicAppointmentStatistics(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        DynamicAppointmentStatisticsVO statistics = appointmentBookingService.getDynamicAppointmentStatisticsForMember(currentUserId, startDate, endDate);
        return RestResult.success(statistics, "Appointment statistics retrieved successfully.");
    }

    /**
     * Determine if current member has established a connection with specified trainer (i.e., connect request accepted)
     *
     * @param trainerId Trainer ID, provided by frontend
     * @return Connection status: true if connected, false if not
     */
    @GetMapping("/is-connected/{trainerId}")
    public RestResult<?> isConnectedWithTrainer(@PathVariable("trainerId") Long trainerId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        boolean connected = trainerConnectRequestService.isConnected(currentUserId, trainerId);
        return RestResult.success(connected, "Connection status retrieved successfully.");
    }

}
