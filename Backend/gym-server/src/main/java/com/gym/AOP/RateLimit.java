package com.gym.AOP;

import java.lang.annotation.*;

@Target(ElementType.METHOD)        //  used on methods
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    /**
     * timeWindowSeconds: The time window in seconds for rate limiting.
     */
    int timeWindowSeconds() default 60;

    /**
     * maxRequests: The maximum number of requests allowed within the timeWindowSeconds.
     */
    int maxRequests() default 10;

    /**
     * message: Customizable message to display when the rate limit is exceeded.
     */
    String message() default "Too many requests. Please try again later.";
}
