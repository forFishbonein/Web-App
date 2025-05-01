package com.gym.dto;

import lombok.*;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForceBookingDTO {

    @NotNull(message = "availabilityId cannot be null")
    private Long availabilityId;

    @NotNull(message = "memberId cannot be null")
    private Long memberId;

    private String projectName;
    private String description;
}