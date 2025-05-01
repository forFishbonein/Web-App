package com.gym.vo;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AppointmentWithTimeVO {
    private Long appointmentId;
    private String projectName;
    private String description;
    private String appointmentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
