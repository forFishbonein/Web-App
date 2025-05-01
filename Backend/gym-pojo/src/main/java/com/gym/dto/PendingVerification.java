package com.gym.dto;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PendingVerification {
    private SignupRequest request;
    private String verificationCode;
    private long createTime;
}
