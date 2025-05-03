package com.gym.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.gym.dto.ChangePasswordRequest;
import com.gym.dto.ForgotPasswordRequest;
import com.gym.dto.LoginRequest;
import com.gym.dto.ResetPasswordRequest;
import com.gym.entity.User;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.service.AuthService;
import com.gym.service.MailService;
import com.gym.service.UserService;
import com.gym.util.JwtUtils;
import com.gym.util.SecurityUtils;
import com.gym.vo.LoginResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;


@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    private RedisCacheServiceImpl redisCacheService;

    @Value("${google.clientId}")
    private String googleClientId;

    /**
     * Login using Google ID Token
     * @param googleIdToken the Google ID Token provided from the frontend
     * @return LoginResponse
     */
    @Override
    public LoginResponse loginWithGoogle(String googleIdToken) {
        // 1. Verify and parse the Google ID Token
        GoogleIdToken.Payload payload = verifyGoogleIdToken(googleIdToken);
        // If verification fails, verifyGoogleIdToken will throw or return null depending on implementation
        if (payload == null) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Invalid Google ID Token.");
        }

        // 2. Extract key information from payload: email, sub (Google unique identifier), name, etc.
        String email = payload.getEmail();
        String googleUserId = payload.getSubject(); // sub
        String name = (String) payload.get("name");

        log.info("Google user info: email={}, sub={}, name={}", email, googleUserId, name);

        // 3. Check if corresponding user exists in the database
        User user = userService.getByEmail(email);
        if (user == null) {
            // If user does not exist, automatically register a new account
            user = registerNewGoogleUser(email, name);
            LoginResponse resp = new LoginResponse();
            return resp;
        } else {
            // If user exists, optionally update user information such as name
            // user.setName(name);
            // userService.updateById(user);
        }

        // 4. Check user status (e.g., Pending, Suspended)
        if (user.getAccountStatus() == User.AccountStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Your account is pending admin review.");
        }
        if (user.getAccountStatus() == User.AccountStatus.Suspended) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Your account is suspended.");
        }

        // 5. Generate our own JWT
        String token = jwtUtils.generateToken(user);
        LoginResponse resp = new LoginResponse();
        resp.setToken(token);
        resp.setUserId(user.getUserID());
        resp.setRole(user.getRole());

        return resp;
    }

    /**
     * Verify the ID Token using Google's library
     */
    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
        try {
            // Construct a verifier
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            } else {
                log.error("Invalid ID Token, verify returned null.");
                return null;
            }
        } catch (Exception e) {
            log.error("Google ID Token verify exception: ", e);
            return null;
        }
    }

    /**
     * Automatically create a new account for a completely new Google user and persist to the database
     */
    private User registerNewGoogleUser(String email, String name) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        // If you allow subsequent login with username/password, you can set a random password or leave it blank
        // Here is just an example
        // newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        newUser.setRole(User.Role.member);
        newUser.setAccountStatus(User.AccountStatus.Pending);
        // You could also set to Approved immediately depending on your business needs

        userService.createUser(newUser);  // existing creation logic

        // If you need to create additional data asynchronously, you can publish an event here
        return newUser;
    }

    @Override
    public LoginResponse login(LoginRequest loginReq) {
        User user = userService.getByEmail(loginReq.getEmail());
        if (user == null || !passwordEncoder.matches(loginReq.getPassword(), user.getPasswordHash())) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Incorrect email or password.");
        }
        if (user.getAccountStatus() == User.AccountStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Your account is pending admin review.");
        }
        if (user.getAccountStatus() == User.AccountStatus.Suspended) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Your account is suspended.");
        }
        // Generate JWT
        String token = jwtUtils.generateToken(user);
        LoginResponse resp = new LoginResponse();
        resp.setToken(token);
        resp.setUserId(user.getUserID());
        resp.setRole(user.getRole());
        return resp;
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        // Query only necessary fields
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(
                        User::getUserID,
                        User::getEmail,
                        User::getAccountStatus
                )
                .eq(User::getEmail, request.getEmail());
        User user = userService.getOne(queryWrapper);

        // For security reasons, if user does not exist, simply return without error
        if (user == null) {
            return;
        }
        if (user.getAccountStatus() == User.AccountStatus.Suspended || user.getAccountStatus() == User.AccountStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Your account is not eligible for password reset.");
        }
        // Generate JWT token for password reset
        String resetToken = jwtUtils.generateResetToken(user);
        // Construct reset link (frontend route configured as needed)
        String resetLink = "http://8.208.16.103/reset-password?token=" + resetToken;
        // Send reset password email asynchronously
        mailService.sendResetLink(request.getEmail(), resetLink);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        // Verify the token via JWT to obtain the email
        String email = jwtUtils.verifyResetToken(request.getToken());
        User user = userService.getByEmail(email);
        if (user == null) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Email is not registered.");
        }
        // Update password and synchronize cache
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userService.updateById(user);
        redisCacheService.updateUser(user);
        log.info("User password reset success, email={}", email);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        // Retrieve the current logged-in user's ID
        Long currentUserId = SecurityUtils.getCurrentUserId();
        // Query user information by user ID
        User user = userService.getById(currentUserId);
        if (user == null) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "User not found.");
        }
        // Verify that the old password provided by the user is correct
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Old password is incorrect.");
        }
        // Update the password (encrypt before storing)
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        // Update the database
        boolean updateSuccess = userService.updateById(user);
        if (!updateSuccess) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to update password. Please try again.");
        }
    }
}

