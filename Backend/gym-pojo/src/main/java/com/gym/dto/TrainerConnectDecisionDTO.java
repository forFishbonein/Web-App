package com.gym.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class TrainerConnectDecisionDTO {
private Long requestId;

    private String responseMessage;
}
