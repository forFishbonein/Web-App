package com.gym.dto;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AppointmentBookingDTO {
    private Long trainerId;

    private Long availabilityId;

    private String projectName;

    private String description;
}

