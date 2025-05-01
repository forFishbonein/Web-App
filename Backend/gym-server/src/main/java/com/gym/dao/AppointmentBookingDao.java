package com.gym.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.entity.AppointmentBooking;
import com.gym.vo.AppointmentBookingDetailVO;
import com.gym.vo.AppointmentBookingHistoryDetailVO;
import com.gym.vo.DailyStatisticVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AppointmentBookingDao extends BaseMapper<AppointmentBooking> {

    @Select("<script>"
            + "SELECT ab.appointment_id, ab.project_name, ab.description, "
            + "       ab.appointment_status, ab.created_at AS bookingCreatedAt, "
            + "       ta.start_time  AS sessionStartTime, "
            + "       ta.end_time    AS sessionEndTime, "
            + "       u.name         AS trainerName, "
            + "       wp.title       AS workoutPlanTitle,  "   /* ★ */
            + "       wp.content     AS workoutPlanContent "   /* ★ */
            + "FROM appointment_bookings ab "
            + "JOIN trainer_availability ta ON ab.availability_id = ta.availability_id "
            + "JOIN users u                 ON ab.trainer_id      = u.user_id "
            + "LEFT JOIN workout_plans wp   ON ab.workout_plan_id = wp.plan_id "
            + "WHERE ab.member_id = #{memberId} "
            + "AND ta.start_time &gt; NOW() "
            + "<choose>"
            + "  <when test='status != null and status != \"\"'> "
            + "       AND ab.appointment_status = #{status} "
            + "  </when>"
            + "  <otherwise>"
            + "       AND ab.appointment_status IN ('Pending','Approved') "
            + "  </otherwise>"
            + "</choose>"
            + "ORDER BY ta.start_time"
            + "</script>")
    Page<AppointmentBookingDetailVO> selectUpcomingAppointmentsByMember(
            Page<?> page,
            @Param("memberId") Long memberId,
            @Param("status")   String status);

    @Select("<script>"
            + "SELECT ab.appointment_id, ab.project_name, ab.description, "
            + "       ab.appointment_status, ab.created_at AS bookingCreatedAt, "
            + "       ta.start_time  AS sessionStartTime, "
            + "       ta.end_time    AS sessionEndTime, "
            + "       u.name         AS trainerName, "
            + "       alt.alternative_trainer_id   AS alternativeTrainerId, "
            + "       alt.alternative_trainer_name AS alternativeTrainerName, "
            + "       wp.title       AS workoutPlanTitle,  "   /* ★ */
            + "       wp.content     AS workoutPlanContent "   /* ★ */
            + "FROM appointment_bookings ab "
            + "JOIN trainer_availability ta        ON ab.availability_id   = ta.availability_id "
            + "JOIN users u                        ON ab.trainer_id        = u.user_id "
            + "LEFT JOIN appointment_alternative_trainer alt "
            + "                                     ON ab.appointment_id    = alt.appointment_id "
            + "LEFT JOIN workout_plans wp          ON ab.workout_plan_id    = wp.plan_id "
            + "WHERE ab.member_id = #{memberId} "
            + "<choose>"
            + "  <when test='status != null and status != \"\"'> "
            + "       AND ab.appointment_status = #{status} "
            + "  </when>"
            + "  <otherwise>"
            + "       AND ab.appointment_status NOT IN ('Pending','Approved') "
            + "  </otherwise>"
            + "</choose>"
            + "ORDER BY ab.updated_at DESC"
            + "</script>")
    Page<AppointmentBookingHistoryDetailVO> selectHistoricalAppointmentsByMember(
            Page<?> page,
            @Param("memberId") Long memberId,
            @Param("status")   String status);


    @Select("<script>" +
            "SELECT DATE(ta.end_time) AS date, COUNT(*) * 0.5 AS hours " +
            "FROM appointment_bookings ab " +
            "JOIN trainer_availability ta ON ab.availability_id = ta.availability_id " +
            "WHERE ab.member_id = #{memberId} " +
            "  AND ab.appointment_status = 'Completed' " +
            "  AND ta.end_time BETWEEN #{startDate} AND #{endDate} " +
            "GROUP BY DATE(ta.end_time) " +
            "ORDER BY date ASC" +
            "</script>")
    List<DailyStatisticVO> selectDynamicStatisticsByMember(@Param("memberId") Long memberId,
                                                           @Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate);


    /**
     * Check if there are overlapping appointments (status: Pending or Approved) for a given user within a specified time range.
     * The condition for two intervals to overlap: existing.start_time < new_end_time AND existing.end_time > new_start_time
     *
     * @param memberId       User ID
     * @param newStartTime   Start time of the new appointment
     * @param newEndTime     End time of the new appointment
     * @return Number of overlapping appointments
     */
    @Select("SELECT COUNT(*) " +
            "FROM appointment_bookings ab " +
            "JOIN trainer_availability ta ON ab.availability_id = ta.availability_id " +
            "WHERE ab.member_id = #{memberId} " +
            "AND ab.appointment_status IN ('Pending', 'Approved') " +
            "AND ta.start_time < #{newEndTime} " +
            "AND ta.end_time > #{newStartTime}")
    int countOverlappingAppointments(@Param("memberId") Long memberId,
                                     @Param("newStartTime") LocalDateTime newStartTime,
                                     @Param("newEndTime") LocalDateTime newEndTime);


    /* === Trainer dynamic statistics === */
    @Select("<script>" +
            "SELECT DATE(ta.end_time)              AS date, " +
            "       COUNT(*) * 0.5                       AS hours " +
            "FROM appointment_bookings ab " +
                    "JOIN trainer_availability ta " +
                    "     ON ab.availability_id = ta.availability_id " +
                    "WHERE ab.trainer_id = #{trainerId} " +
                    "  AND ab.appointment_status = 'Completed' " +
                    "  AND ta.end_time BETWEEN #{startDate} AND #{endDate} " +
                    "GROUP BY DATE(ta.end_time) " +
                    "ORDER BY date ASC" +
                    "</script>")
    List<DailyStatisticVO> selectDynamicStatisticsByTrainer(
            @Param("trainerId") Long trainerId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate")   LocalDate endDate);
}


