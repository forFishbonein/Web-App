package com.gym.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gym.dto.AppointmentBookingDTO;
import com.gym.dto.AppointmentDecisionDTO;
import com.gym.dto.AppointmentDecisionRejectDTO;
import com.gym.dto.ForceBookingDTO;
import com.gym.entity.AppointmentBooking;
import com.gym.vo.AppointmentBookingDetailVO;
import com.gym.vo.AppointmentBookingHistoryDetailVO;
import com.gym.vo.CompletedAppointmentVO;
import com.gym.vo.DynamicAppointmentStatisticsVO;
import com.gym.vo.MemberAppointmentsVO;
import com.gym.vo.PendingAppointmentVO;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentBookingService extends IService<AppointmentBooking> {
    /**
     * Business logic for a member booking a session:
     * Validates the connection between member and trainer, checks the selected availability slot,
     * updates that slot to Booked, creates a booking record with status Pending, and notifies the trainer for review.
     *
     * @param dto       Booking request data
     * @param memberId  ID of the current member
     */
    void bookSession(AppointmentBookingDTO dto, Long memberId);

    /**
     * Trainer approves a booking request: updates booking status to Approved,
     * updates the corresponding availability slot to Booked, and notifies the member.
     *
     * @param dto         Contains booking ID and optional feedback
     * @param trainerId   ID of the current trainer
     */
    void acceptAppointment(AppointmentDecisionDTO dto, Long trainerId);

    /**
     * Trainer rejects a booking request: updates booking status to Rejected and notifies the member.
     *
     * @param dto         Contains booking ID and optional feedback
     * @param trainerId   ID of the current trainer
     */
    void rejectAppointment(AppointmentDecisionRejectDTO dto, Long trainerId);

    /**
     * Retrieves pending and unexpired booking requests for a trainer, including session times.
     *
     * @param trainerId   ID of the trainer
     * @return List of pending appointments with time details
     */
    List<PendingAppointmentVO> getPendingAppointmentsForTrainerWithTimes(Long trainerId);

    /**
     * Paginate through upcoming bookings for the current member.
     * By default returns bookings with status Pending and Approved; if status is provided, filters by that status.
     *
     * @param memberId  ID of the current member
     * @param page      Pagination object
     * @param status    Optional status filter
     * @return Paginated result
     */
    Page<AppointmentBookingDetailVO> getUpcomingAppointmentsForMember(
            Long memberId,
            Page<AppointmentBookingDetailVO> page,
            String status);

    /**
     * Paginate through historical bookings for the current member.
     * By default returns bookings with statuses other than Pending and Approved; if status is provided, filters by that status.
     *
     * @param memberId  ID of the current member
     * @param page      Pagination object
     * @param status    Optional status filter
     * @return Paginated result
     */
    Page<AppointmentBookingHistoryDetailVO> getHistoricalAppointmentsForMember(
            Long memberId,
            Page<AppointmentBookingHistoryDetailVO> page,
            String status);

    /**
     * Cancel a booking request.
     * Allows cancellation for Pending bookings; disallows direct cancellation if status is Approved.
     *
     * @param appointmentId  ID of the booking record
     * @param memberId       ID of the current member
     */
    void cancelAppointment(Long appointmentId, Long memberId);

    /**
     * Retrieves booking statistics for the current member within a specified date range,
     * returning the number of session hours completed per day (in hours).
     *
     * @param memberId   ID of the current member
     * @param startDate  Start date for statistics (format yyyy-MM-dd)
     * @param endDate    End date for statistics (format yyyy-MM-dd)
     * @return Dynamic statistics data VO
     */
    DynamicAppointmentStatisticsVO getDynamicAppointmentStatisticsForMember(
            Long memberId,
            LocalDate startDate,
            LocalDate endDate);

    /**
     * Retrieves all approved bookings for a trainer, including member names and session times.
     *
     * @param trainerId  ID of the trainer
     * @return List of approved appointments with time details
     */
    List<PendingAppointmentVO> getApprovedAppointmentsForTrainerWithTimes(Long trainerId);

    /**
     * Marks a specified booking as Completed.
     *
     * @param appointmentId  ID of the booking record
     * @param trainerId      ID of the trainer
     */
    void completeAppointment(Long appointmentId, Long trainerId);

    /**
     * Retrieves all bookings for a trainer, grouped by member,
     * including start and end times for each session.
     *
     * @param trainerId   ID of the trainer
     * @return List of member appointments grouped by member
     */
    List<MemberAppointmentsVO> getAllAppointmentsGroupedByMember(Long trainerId);

    /**
     * Retrieves all completed bookings for a trainer.
     *
     * @param trainerId   ID of the trainer
     * @return List of completed appointments
     */
    List<CompletedAppointmentVO> getCompletedAppointmentsForTrainer(Long trainerId);

    /**
     * Retrieves daily completed session hours for a trainer within a specified date range (≤30 days).
     *
     * @param trainerId   ID of the trainer
     * @param startDate   Start date for statistics (format yyyy-MM-dd)
     * @param endDate     End date for statistics (format yyyy-MM-dd)
     * @return Dynamic statistics data VO
     */
    DynamicAppointmentStatisticsVO getDynamicAppointmentStatisticsForTrainer(
            Long trainerId,
            LocalDate startDate,
            LocalDate endDate);

    /**
     * Binds a workout plan to a specific booking.
     *
     * @param trainerId     ID of the trainer
     * @param appointmentId ID of the booking
     * @param planId        ID of the workout plan
     */
    void bindWorkoutPlan(Long trainerId, Long appointmentId, Long planId);

    void forceBookSession(Long trainerId, ForceBookingDTO dto);
}

