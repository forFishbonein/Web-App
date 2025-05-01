package com.gym.vo;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CompletedAppointmentVO {
    private Long appointmentId;
    private Long memberId;
    private String memberName;
    private String projectName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
