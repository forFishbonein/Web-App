package com.gym.controller;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gym.AOP.RateLimit;
import com.gym.bloomFilter.BloomFilterUtil;
import com.gym.dto.*;
import com.gym.dto.redis.PendingPasswordReset;
import com.gym.entity.*;
import com.gym.service.*;
import com.gym.service.impl.RedisCacheServiceImpl;
import com.gym.util.IpUtil;
import com.gym.util.SecurityUtils;
import com.gym.util.TencentCaptchaUtil;
import com.gym.vo.FitnessCentreVO;
import com.gym.vo.LoginResponse;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.result.RestResult;
import com.gym.util.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private TencentCaptchaUtil tencentCaptchaUtil;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FitnessCentreService fitnessCentreService;

    // Used to generate Tencent robot captcha
    private void validateCaptcha(String captchaTicket, String captchaRandstr, HttpServletRequest request) {
        String clientIp = IpUtil.getClientIp(request);
        // 打印ip看一下是不是用户ip还是nginx
        log.info("Client IP: {}", clientIp);
        boolean captchaValid = tencentCaptchaUtil.verifyCaptcha(captchaTicket, captchaRandstr, clientIp);
        if (!captchaValid) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Captcha verification failed.");
        }
    }

    /**
     * Registration step 1: send verification email
     */
    @PostMapping("/signup")
    // Rate limit annotation: maximum 5 requests within 60 seconds
    @RateLimit(timeWindowSeconds = 60, maxRequests = 5,
            message = "Too many signup requests. Please try again later.")
    public RestResult<?> signup(@Valid @RequestBody SignupRequest request, HttpServletRequest httpRequest) {
        // Perform captcha verification first
        validateCaptcha(request.getCaptchaTicket(), request.getCaptchaRandstr(), httpRequest);

        log.info("signup request: {}", request);
        userService.sendSignupVerification(request);
        return RestResult.success(null, "Verification code has been sent to your email. Please enter it to complete registration.");
    }

    /**
     * Registration step 2: verify code and complete registration
     */
    @PostMapping("/verify-code")
    public RestResult<?> verifyCode(@Valid @RequestBody VerifyCodeRequest verifyReq) {
        userService.verifySignupCode(verifyReq);
        return RestResult.success(null, "Registration successful. Awaiting admin approval.");
    }

    /**
     * Login endpoint (includes JWT authentication)
     */
    @PostMapping("/login")
    public RestResult<LoginResponse> login(@Valid @RequestBody LoginRequest loginReq,
                                           HttpServletRequest httpRequest) {
        // Perform captcha verification first
        validateCaptcha(loginReq.getCaptchaTicket(), loginReq.getCaptchaRandstr(), httpRequest);
        LoginResponse response = authService.login(loginReq);
        return RestResult.success(response, "Login success.");
    }

    /**
     * Forgot password: send reset link
     */
    @PostMapping("/forgot-password")
    @RateLimit(timeWindowSeconds = 60, maxRequests = 5,
            message = "Too many reset password requests. Please try again later.")
    public RestResult<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request,
                                        HttpServletRequest httpRequest) {
        // Perform captcha verification first
        validateCaptcha(request.getCaptchaTicket(), request.getCaptchaRandstr(), httpRequest);
        authService.forgotPassword(request);
        return RestResult.success(null, "A password reset link has been sent to your email.");
    }

    /**
     * Reset password endpoint
     */
    @PostMapping("/reset-password")
    public RestResult<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return RestResult.success(null, "Password reset successful. " +
                "Please log in with your new password.");
    }

    @PostMapping("/change-password")
    public RestResult<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        authService.changePassword(request);
        return RestResult.success(null, "Password changed successfully.");
    }

    /**
     * Update user personal profile
     */
    @PostMapping("/user-profile")
    public RestResult<?> updateUserProfile(@Valid @RequestBody UserProfileDTO request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        userService.updateUserProfile(currentUserId, request);
        return RestResult.success("Updated", "User profile updated successfully.");
    }

    // New endpoint: paginate and query current user's notifications (service layer contains business logic)
    @GetMapping("/notifications")
    public RestResult<?> getNotifications(@RequestParam(defaultValue = "1") Integer page,
                                          @RequestParam(defaultValue = "10") Integer pageSize) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        // Return all notifications!
        Page<Notification> notificationsPage = notificationService.getNotificationsByUser(currentUserId, page, pageSize);
        return RestResult.success(notificationsPage, "Notifications retrieved successfully.");
    }

    // New endpoint: mark specified notification as read (service layer contains business logic)
    @PutMapping("/notifications/{notificationId}/read")
    public RestResult<?> markNotificationAsRead(@PathVariable("notificationId") Long notificationId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        notificationService.markAsRead(notificationId, currentUserId);
        return RestResult.success(null, "Notification marked as read successfully.");
    }

    // New delete notification endpoint: only allows deletion of read notifications
    @DeleteMapping("/notifications/{notificationId}")
    public RestResult<?> deleteNotification(@PathVariable("notificationId") Long notificationId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }
        notificationService.deleteNotification(notificationId, currentUserId);
        return RestResult.success(null, "Notification deleted successfully.");
    }

    @PostMapping("/google-login")
    public RestResult<LoginResponse> googleLogin(@RequestBody @Valid GoogleLoginRequest request) {
        // 1. Directly call AuthService method for Google login
        LoginResponse loginResponse = authService.loginWithGoogle(request.getIdToken());
        // 2. Return the same response structure as normal login
        return RestResult.success(loginResponse, "Google Login success.");
    }

    // Endpoint to list all specialization constants
    @GetMapping("/specializations")
    public RestResult<?> listSpecializations() {
        // Call service layer method to query all specialization data
        List<Specializations> specializations = userService.listSpecializations();
        // Wrap result with RestResult.success; frontend will receive code, message, data
        return RestResult.success(specializations, "Specializations retrieved successfully.");
    }

    // Query locations
    /**
     * Query all fitness center locations
     * Frontend needs fields:
     * - title: display name (currently using the name field; can extend for chain info)
     * - address: standard English address (including postal code)
     * - latitude: longitude
     * - longitude: latitude
     * - contactInfo: contact information
     */
    @GetMapping("/locations")
    public RestResult<?> getFitnessCentreLocations() {
        // Query all fitness center records using MyBatis-Plus list()
        List<FitnessCentre> centres = fitnessCentreService.list();

        // Convert entities to VO
        List<FitnessCentreVO> voList = centres.stream().map(centre -> FitnessCentreVO.builder()
                        .title(centre.getName())  // Can modify for chains, e.g. "Chain: " + centre.getName()
                        .address(centre.getAddress())
                        .latitude(centre.getLatitude())
                        .longitude(centre.getLongitude())
                        .contactInfo(centre.getContactInfo())
                        .build())
                .collect(Collectors.toList());

        return RestResult.success(voList, "Locations retrieved successfully.");
    }
}
