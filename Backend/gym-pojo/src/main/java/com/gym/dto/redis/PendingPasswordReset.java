package com.gym.dto.redis;

import lombok.*;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PendingPasswordReset implements Serializable {
    private String email;
    private String resetCode;
    private long createTime;
}
