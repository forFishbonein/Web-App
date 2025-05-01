package com.gym.AOP;

import com.gym.exception.CustomException;
import com.gym.util.IpUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import com.gym.enumeration.ErrorCode;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
@Slf4j
public class RateLimitAspect {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private HttpServletRequest request;

    /**
     * Configure the pointcut:
     * Intercept all methods annotated with @RateLimit
     */
    @Pointcut("@annotation(com.gym.AOP.RateLimit)")
    public void rateLimitPointcut() {}

    /**
     * Around advice to execute the specific rate-limiting logic
     */
    @Around("rateLimitPointcut() && @annotation(rateLimit)")
    public Object around(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {

        // 1. Construct the rate limit key: use client IP + method signature
        String clientIp = IpUtil.getClientIp(request);
        String methodName = joinPoint.getSignature().toShortString();
        String redisKey = "RATE_LIMIT:" + methodName + ":" + clientIp;

        int timeWindowSeconds = rateLimit.timeWindowSeconds();
        int maxRequests = rateLimit.maxRequests();
        String message = rateLimit.message();

        // 2. Use Redis incr to count
        Long currentCount = redisTemplate.opsForValue().increment(redisKey, 1);
        if (currentCount != null) {
            // If it's the first count, set the expiration time
            if (currentCount == 1) {
                redisTemplate.expire(redisKey, timeWindowSeconds, TimeUnit.SECONDS);
            }

            // If the limit is exceeded, throw an exception
            if (currentCount > maxRequests) {
                log.warn("Rate limit triggered, key={}, count={}, limit={}", redisKey, currentCount, maxRequests);
                throw new CustomException(ErrorCode.TOO_MANY_REQUESTS, message);
            }
        }

        // 3. Continue executing the intercepted method
        return joinPoint.proceed();
    }
}