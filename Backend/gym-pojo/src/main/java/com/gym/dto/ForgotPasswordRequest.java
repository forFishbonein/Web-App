package com.gym.dto;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ForgotPasswordRequest {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email is invalid")
    private String email;
    @NotBlank(message = "Captcha ticket cannot be blank")
    private String captchaTicket;

    @NotBlank(message = "Captcha randstr cannot be blank")
    private String captchaRandstr;
}
