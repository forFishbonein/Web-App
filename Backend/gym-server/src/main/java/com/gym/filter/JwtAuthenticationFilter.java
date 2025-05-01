package com.gym.filter;

import com.gym.entity.User;
import com.gym.service.RedisCacheService;
import com.gym.util.JwtUtils;
import com.gym.util.UserRoleUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Executed before every request:
 * 1) Extract the token from the Header
 * 2) Validate the token
 * 3) Store user information into the SecurityContext
 */
@Slf4j
@Component
// Filters extending OncePerRequestFilter ensure doFilterInternal is called only once per HTTP request
// In your SecurityConfig there is a line:
// http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
// Therefore, when an HTTP request arrives,
// Spring Security will invoke your JwtAuthenticationFilter (extending OncePerRequestFilter) first
// to parse and authenticate the JWT token, then proceed to subsequent filters
// (such as UsernamePasswordAuthenticationFilter) and other security components.
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RedisCacheService redisCacheService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // If a token is present, validate it
        if (token != null && jwtUtils.validateToken(token)) {
            Claims claims = jwtUtils.getClaims(token);
            String userIdStr = claims.getSubject(); // userId is stored in the subject
            String roleStr = (String) claims.get("role");

            try {
                Long userId = Long.valueOf(userIdStr);
                // Fetch user information from cache
                User user = redisCacheService.getUser(userId);

                // Check if the user has been disabled or if the user's role has changed
                // If the user is valid, set the authentication details for this HTTP request
                // so that downstream logic can access the user information
                if (user != null && user.getRole().name().equals(roleStr)) {
                    // Build the Spring Security authentication object
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    user, // Principal; later accessible via SecurityContextHolder.getContext().getAuthentication().getPrincipal()
                                    null, // Credentials
                                    // Grant the user's role as authority
                                    UserRoleUtil.buildAuthorities(user.getRole())
                            );
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Store the authentication information in the context
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } catch (NumberFormatException e) {
                log.warn("Token subject is not a numeric type: {}", userIdStr);
            }
        }

        // Allow requests with invalid tokens to skip authentication, then let Spring Security decide
        // whether to respond with 401/403. For example, a controller annotated with
        // @PreAuthorize("hasRole('Admin')") will reject unauthorized access.
        // Proceed with the filter chain
        filterChain.doFilter(request, response);
    }
}

// The logic here integrates the JWT filter into the security filter chain. It does not actively reject requests;
// it is responsible for parsing and validating the JWT from incoming requests and setting the security context.
// If there is no valid JWT, it does not block the request but lets subsequent Spring Security components
// decide whether to allow access to protected resources. Detailed behavior:
//
// All requests pass through the filter:
// Regardless of whether the user accesses a registration page, login page, or other protected endpoint,
// the doFilterInternal method of JwtAuthenticationFilter will be executed. This does not mean every request
// requires a JWT.
//
// Public endpoints (login, signup) are configured with permitAll().
//
// For login and registration endpoints, even though JwtAuthenticationFilter runs,
// typically:
// - The request header won't contain an Authorization field (no JWT).
// - The filter, upon finding no token or an invalid token (jwtUtils.validateToken(token) returns false),
//   does not set an authentication object in the SecurityContext.
// - Since /user/signup, /user/verify-code, /user/login are configured with permitAll(),
//   access is still allowed without authentication.
//
// Token expiration or invalidation:
// - If a provided JWT is invalid or expired, jwtUtils.validateToken(token) returns false.
// - The filter stops parsing and does not set the SecurityContext.
// - The filter itself does not reject the request but allows security configs to do so.
//   For protected endpoints (not in permitAll), absence of authentication in SecurityContext
//   causes Spring Security to reject the request (401 or 403).
//
// Design rationale:
// - Single responsibility: The filter only handles JWT parsing and validation, populating the SecurityContext.
//   It does not block requests on its own, leaving authorization decisions to the security framework.
// - Security configurations intercept requests: In SecurityConfig, antMatchers(...).permitAll() specifies public paths,
//   while other paths require valid authentication. This separation of JWT parsing and request authorization
//   leads to clearer logic.
//
// Summary:
// - For public endpoints (signup, login), JwtAuthenticationFilter runs but without a token or with an invalid one,
//   no authentication is set, and since these endpoints are permitAll, requests proceed normally.
// - For protected endpoints, absence of a valid JWT means no authentication is set, and Spring Security will reject the request.
