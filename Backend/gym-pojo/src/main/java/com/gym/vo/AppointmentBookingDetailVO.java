package com.gym.vo;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AppointmentBookingDetailVO {
    private Long appointmentId;
    private String projectName;
    private String description;
    private String appointmentStatus;
    private LocalDateTime bookingCreatedAt;
    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;
    private String trainerName;

    private String         workoutPlanTitle;
    private String         workoutPlanContent;
}
