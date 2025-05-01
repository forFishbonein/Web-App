package com.gym.util;

import com.gym.entity.User;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
class JwtUtilsTest {
    private JwtUtils jwtUtils;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        // Simulate injecting configuration properties. Note: If the secretKey and expiration properties are private,
        // consider adding package-level or public setter methods in the JwtUtils class, or use reflection to set them.

        jwtUtils.setSecretKey("testSecretKey");
        jwtUtils.setExpiration(3600000); // Expiration time of 1 hour, in milliseconds
        log.debug("JwtUtilsTest setup done");
    }

    @Test
    public void testGenerateAndValidateToken() {
        // Create a mock user object
        User user = new User();
        user.setUserID(100L);
        user.setRole(User.Role.member); // Assume the User class has a Role enum
        user.setEmail("test@example.com");

        // Generate Token
        String token = jwtUtils.generateToken(user);
        assertNotNull(token, "Generated token should not be null");
        log.debug("Generated token: {}", token);

        // Validate Token
        boolean isValid = jwtUtils.validateToken(token);
        assertTrue(isValid, "Generated token should be valid");
        log.debug("Token is valid: {}", isValid);

        // Extract Claims from the Token and verify the contained information
        Claims claims = jwtUtils.getClaims(token);
        assertEquals(String.valueOf(user.getUserID()), claims.getSubject(), "Subject should match the user ID");
        assertEquals(user.getRole().name(), claims.get("role"), "Role information should match");
        assertEquals(user.getEmail(), claims.get("email"), "Email information should match");
        log.debug("Claims: {}", claims);
    }

    @Test
    public void testInvalidToken() {
        // Create a mock user object
        User user = new User();
        user.setUserID(101L);
        user.setRole(User.Role.member);
        user.setEmail("test2@example.com");

        // Generate Token
        String token = jwtUtils.generateToken(user);
        assertNotNull(token, "Generated token should not be null");

        // Simulate tampering with the Token, e.g., changing the last character of the Token
        String tamperedToken = token.substring(0, token.length() - 1) + "x";
        boolean isValid = jwtUtils.validateToken(tamperedToken);
        assertFalse(isValid, "Tampered token should be considered invalid");

        log.debug("Tampered token is invalid: {}", isValid);
    }

}