package com.gym.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AppointmentDecisionRejectDTO {
    private Long appointmentId;

    private String responseMessage;

    private Long alternativeTrainerId;

    private String alternativeTrainerName;

}
