package com.gym.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class TrainerProfileQuery {
    private Integer page = 1;
    private Integer pageSize = 10;

    private String specializations;
    private String workplace;
}
