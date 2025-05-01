package com.gym.vo;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DailyStatisticVO {
    /**
     * The date for the statistic
     */
    private LocalDate date;

    private Double hours;
}
