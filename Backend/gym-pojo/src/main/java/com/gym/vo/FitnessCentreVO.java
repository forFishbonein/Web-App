package com.gym.vo;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class FitnessCentreVO {
    private String title;

    private String address;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private String contactInfo;
}
