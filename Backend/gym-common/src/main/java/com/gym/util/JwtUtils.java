package com.gym.util;

import com.gym.entity.User;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import io.jsonwebtoken.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Example based on io.jsonwebtoken 0.9.1
 */
@Component
@Data
public class JwtUtils {

    // Read configuration from application.properties / application.yml
    @Value("${jwt.secret:defaultSecretKey}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // Default 1 day (milliseconds)
    private long expiration;

    /**
     * Generate JWT Token
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);

        // Store userId in Subject, can also be added to Claims
        return Jwts.builder()
                .setSubject(String.valueOf(user.getUserID()))
                .claim("role", user.getRole().name())
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    /**
     * Check if the Token is valid (signature is correct & not expired)
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            // Includes SignatureException, ExpiredJwtException, etc.
            return false;
        }
    }

    /**
     * Get all claims from the token
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Generate a reset password JWT Token, recommended validity is 5 minutes
     */
    public String generateResetToken(User user) {
        // Example: When generating JWT, set subject to user email, add purpose identifier to claims, etc.
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 5 * 60 * 1000); // Expires in 5 minutes

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("type", "reset")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    /**
     * Validate the reset password JWT Token, return email or null (or throw an exception)
     */
    public String verifyResetToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
            // Check if the token type is reset
            if (!"reset".equals(claims.get("type"))) {
                throw new CustomException(ErrorCode.BAD_REQUEST, "Invalid token type.");
            }
            return claims.getSubject(); // Return email
        } catch (Exception e) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Invalid or expired reset token.");
        }
    }

}