package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.dto.*;
import com.gym.entity.*;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.result.RestResult;
import com.gym.service.*;
import com.gym.util.SecurityUtils;
import com.gym.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/trainer")
@Slf4j
@PreAuthorize("hasRole('trainer')")
public class TrainerController {

    @Autowired
    private TrainerProfileService trainerProfileService;

    @Autowired
    private TrainerConnectRequestService trainerConnectRequestService;

    @Autowired
    private TrainerAvailabilityService trainerAvailabilityService;

    @Autowired
    private AppointmentBookingService appointmentBookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @Autowired
    private FitnessCentreService fitnessCentreService;

    /**
     * Update the current trainer's profile using DTO.
     *
     * This method receives a TrainerProfileDTO object from the client,
     * retrieves the current trainer profile from the database using the user ID from JWT,
     * and updates the profile fields accordingly.
     *
     * @param trainerProfileDTO the profile data to update
     * @return a RestResult indicating success or failure
     */
    @PutMapping("/profile")
    public RestResult<?> updateTrainerProfile(@Valid @RequestBody TrainerProfileDTO trainerProfileDTO) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }

        // Update the TrainerProfile record in the database using data from the DTO
        LambdaUpdateWrapper<TrainerProfile> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(TrainerProfile::getUserId, currentUserId)
                .set(TrainerProfile::getCertifications, trainerProfileDTO.getCertifications())
                .set(TrainerProfile::getSpecializations, trainerProfileDTO.getSpecializations())
                .set(TrainerProfile::getYearsOfExperience, trainerProfileDTO.getYearsOfExperience())
                .set(TrainerProfile::getBiography, trainerProfileDTO.getBiography())
                .set(TrainerProfile::getWorkplace, trainerProfileDTO.getWorkplace());

        boolean updateResult = trainerProfileService.update(updateWrapper);
        if (!updateResult) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Update failed: Trainer profile may not exist.");
        }
        log.info("Trainer [{}] profile updated successfully", currentUserId);
        return RestResult.success("Updated", "Trainer profile updated successfully.");
    }

    // Trainer views their detailed profile info and user table info
    @GetMapping("/profile")
    public RestResult<?> getTrainerProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        // Query both tables: user table and trainerProfile table
        TrainerAllProfile trainerAllProfile = trainerProfileService.getTrainerAllProfile(currentUserId);

        return RestResult.success(trainerAllProfile, "Trainer profile retrieved successfully.");
    }

    /**
     * Accept a member's connect request.
     * Only handles trainer authentication and delegates business logic to the service layer.
     *
     * @param decisionDTO contains request ID and optional feedback
     * @return operation result
     */
    @PutMapping("/connect-request/accept")
    public RestResult<?> acceptConnectRequest(@Valid @RequestBody TrainerConnectDecisionDTO decisionDTO) {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        trainerConnectRequestService.acceptConnectRequest(decisionDTO, currentTrainerId);
        log.info("Trainer [{}] accepted connect request [{}]", currentTrainerId, decisionDTO.getRequestId());
        return RestResult.success(null, "Connect request accepted successfully.");
    }

    /**
     * Reject a member's connect request.
     * Only handles trainer authentication and delegates business logic to the service layer.
     *
     * @param decisionDTO contains request ID and optional feedback
     * @return operation result
     */
    @PutMapping("/connect-request/reject")
    public RestResult<?> rejectConnectRequest(@Valid @RequestBody TrainerConnectDecisionDTO decisionDTO) {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        trainerConnectRequestService.rejectConnectRequest(decisionDTO, currentTrainerId);
        log.info("Trainer [{}] rejected connect request [{}]", currentTrainerId, decisionDTO.getRequestId());
        return RestResult.success(null, "Connect request rejected successfully.");
    }

    /**
     * Set or update the trainer's availability.
     * The frontend can submit multiple availability slots at once, e.g., after selecting multiple time blocks on a calendar.
     */
    @PostMapping("/availability")
    public RestResult<?> updateAvailability(@Valid @RequestBody TrainerAvailabilityDTO availabilityDTO) {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        // Assume user ID is converted to Integer type based on TrainerAvailability entity's trainerId type
        trainerAvailabilityService.updateAvailability(currentTrainerId, availabilityDTO.getAvailabilitySlots());
        return RestResult.success(null, "Availability updated successfully.");
    }

    /**
     * Retrieve pending appointment requests (Pending and not expired), returning start/end times
     */
    @GetMapping("/appointments/pending")
    public RestResult<?> getPendingAppointments() {
        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }
        List<PendingAppointmentVO> pending =
                appointmentBookingService.getPendingAppointmentsForTrainerWithTimes(trainerId);
        return RestResult.success(pending, "Pending appointments retrieved successfully.");
    }

    /**
     * This endpoint allows trainers to modify and initialize their availability.
     * It fetches all time slots for the trainer, including booked and unavailable (currently no unavailable).
     * No additional parameters are required from the frontend; the trainer ID is obtained via SecurityUtils.
     */
    @GetMapping("/availability")
    public RestResult<?> getAvailability() {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        List<TrainerAvailability> availabilities = trainerAvailabilityService.getFutureAvailability(currentTrainerId);
        return RestResult.success(availabilities, "Availability retrieved successfully.");
    }

    /**
     * Accept a member's appointment request.
     * The frontend submits an AppointmentDecisionDTO containing the appointment ID and optional feedback.
     */
    @PutMapping("/appointment/accept")
    public RestResult<?> acceptAppointment(@Valid @RequestBody AppointmentDecisionDTO decisionDTO) {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        appointmentBookingService.acceptAppointment(decisionDTO, currentTrainerId);
        log.info("Trainer [{}] accepted appointment [{}]", currentTrainerId, decisionDTO.getAppointmentId());
        return RestResult.success(null, "Appointment accepted successfully.");
    }

    /**
     * Reject a member's appointment request.
     * The frontend submits an AppointmentDecisionRejectDTO containing the appointment ID and optional feedback.
     */
    @PutMapping("/appointment/reject")
    public RestResult<?> rejectAppointment(@Valid @RequestBody AppointmentDecisionRejectDTO decisionDTO) {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        appointmentBookingService.rejectAppointment(decisionDTO, currentTrainerId);
        log.info("Trainer [{}] rejected appointment [{}]", currentTrainerId, decisionDTO.getAppointmentId());
        return RestResult.success(null, "Appointment rejected successfully.");
    }

    /**
     * Retrieve all approved appointments, including member names and session times
     */
    @GetMapping("/appointments/approved")
    public RestResult<?> getApprovedAppointments() {
        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }
        List<PendingAppointmentVO> approved =
                appointmentBookingService.getApprovedAppointmentsForTrainerWithTimes(trainerId);
        return RestResult.success(approved, "Approved appointments retrieved successfully.");
    }

    /**
     * Mark a specified appointment as Completed
     */
    @PutMapping("/appointment/complete")
    public RestResult<?> completeAppointment(@Valid @RequestBody AppointmentCompleteDTO completeDTO) {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        appointmentBookingService.completeAppointment(completeDTO.getAppointmentId(), currentTrainerId);
        log.info("Trainer [{}] completed appointment [{}]", currentTrainerId, completeDTO.getAppointmentId());
        return RestResult.success(null, "Appointment marked as completed successfully.");
    }

    /**
     * GET /trainer/alternative-trainers: Get other trainers available for recommendation (basic info)
     */
    @GetMapping("/alternative-trainers")
    public RestResult<?> getAlternativeTrainers() {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }
        List<TrainerBasicInfoVO> trainers =
                userService.listOtherTrainersBasicInfo(currentTrainerId);

        return RestResult.success(trainers,
                "Alternative trainers retrieved successfully.");
    }

    /**
     * GET /trainer/connect-requests/pending: Retrieve all pending connect requests
     */
    @GetMapping("/connect-requests/pending")
    public RestResult<?> getPendingConnectRequests() {
        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }

        List<PendingConnectRequestVO> pending =
                trainerConnectRequestService.getPendingConnectRequestsForTrainer(trainerId);

        return RestResult.success(pending,
                "Pending connect requests retrieved successfully.");
    }

    /**
     * GET /trainer/appointments/by-member: Get all appointments grouped by member
     */
    @GetMapping("/appointments/by-member")
    public RestResult<?> getAllAppointmentsGroupedByMember() {
        Long currentTrainerId = SecurityUtils.getCurrentUserId();
        if (currentTrainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }
        List<MemberAppointmentsVO> grouped =
                appointmentBookingService.getAllAppointmentsGroupedByMember(currentTrainerId);

        return RestResult.success(grouped,
                "All appointments grouped by member retrieved successfully.");
    }

    /**
     * GET /trainer/connected-members: Retrieve all connected members (Accepted)
     */
    @GetMapping("/connected-members")
    public RestResult<?> getConnectedMembers() {
        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }
        List<ConnectedMemberVO> members =
                trainerConnectRequestService.listConnectedMembers(trainerId);

        return RestResult.success(members,
                "Connected members retrieved successfully.");
    }

    /**
     * GET /trainer/appointments/completed: Retrieve all completed appointments (history), including member names
     */
    @GetMapping("/appointments/completed")
    public RestResult<?> getCompletedAppointments() {
        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }
        List<CompletedAppointmentVO> completed =
                appointmentBookingService.getCompletedAppointmentsForTrainer(trainerId);
        return RestResult.success(completed,
                "Completed appointments retrieved successfully.");
    }

    /**
     * GET /trainer/appointments/statistics/dynamic: Daily completed session hours for a specified date range (≤30 days)
     * Example: /trainer/appointments/statistics/dynamic?startDate=2025-04-01&endDate=2025-04-07
     */
    @GetMapping("/appointments/statistics/dynamic")
    public RestResult<?> getDynamicTrainerStatistics(
            @RequestParam("startDate")
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate")
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED,
                    "User is not authenticated or session is invalid.");
        }

        DynamicAppointmentStatisticsVO vo =
                appointmentBookingService.getDynamicAppointmentStatisticsForTrainer(
                        trainerId, startDate, endDate);

        return RestResult.success(vo,
                "Trainer appointment statistics retrieved successfully.");
    }

    // CRUD workout plans
    @PostMapping("/workout-plans")
    public RestResult<?> createPlan(@Valid @RequestBody WorkoutPlanDTO dto) {
        Long trainerId = SecurityUtils.getCurrentUserId();
        return RestResult.success(
                workoutPlanService.createPlan(trainerId, dto),
                "Plan created");
    }

    @PutMapping("/workout-plans/{planId}")
    public RestResult<?> updatePlan(@PathVariable Long planId,
                                    @Valid @RequestBody WorkoutPlanDTO dto) {
        Long trainerId = SecurityUtils.getCurrentUserId();
        return RestResult.success(
                workoutPlanService.updatePlan(trainerId, planId, dto),
                "Plan updated");
    }

    @DeleteMapping("/workout-plans/{planId}")
    public RestResult<?> deletePlan(@PathVariable Long planId) {
        Long trainerId = SecurityUtils.getCurrentUserId();
        workoutPlanService.deletePlan(trainerId, planId);
        return RestResult.success(null, "Plan deleted");
    }

    @GetMapping("/workout-plans")
    public RestResult<?> listPlans() {
        Long trainerId = SecurityUtils.getCurrentUserId();
        return RestResult.success(
                workoutPlanService.listPlans(trainerId),
                "Plans retrieved");
    }

    // Bind a plan to an appointment
    @PutMapping("/appointments/{appointmentId}/workout-plan/{planId}")
    public RestResult<?> bindPlan(@PathVariable Long appointmentId,
                                  @PathVariable Long planId) {
        Long trainerId = SecurityUtils.getCurrentUserId();
        appointmentBookingService.bindWorkoutPlan(trainerId, appointmentId, planId);
        return RestResult.success(null, "Workout plan bound to appointment");
    }

    /**
     * POST /trainer/appointment/force-book
     */
    @PostMapping("/appointment/force-book")
    public RestResult<?> forceBook(@Valid @RequestBody ForceBookingDTO dto) {
        Long trainerId = SecurityUtils.getCurrentUserId();
        if (trainerId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        appointmentBookingService.forceBookSession(trainerId, dto);
        log.info("Trainer[{}] force-booked availability[{}] for member[{}]",
                trainerId, dto.getAvailabilityId(), dto.getMemberId());
        return RestResult.success(null, "Force booking created and approved successfully.");
    }

    /**
     * List all fitness centres
     * GET /trainer/fitness-centres
     */
    @GetMapping("/fitness-centres")
    public RestResult<?> listFitnessCentres() {
        List<FitnessCentre> centres = fitnessCentreService.listAllCentres();
        return RestResult.success(centres, "Fitness centres retrieved successfully.");
    }
}
