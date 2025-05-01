package com.gym.json;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class MyMetaObjecthandler implements MetaObjectHandler {
    /**
     * Insert operation, auto-fill fields
     * @param metaObject
     */
    // These two methods are overridden from the parent class, provided by MyBatis-Plus
    @Override
    // All fields must be present here; otherwise, it will throw an error. Therefore, validation is required first.
    public void insertFill(MetaObject metaObject) {
        log.info("Automatically filling common fields [insert]...");
        log.info(metaObject.toString());
        if (metaObject.hasSetter("createTime")) {
            metaObject.setValue("createTime", LocalDateTime.now());
        }
        if (metaObject.hasSetter("updateTime")) {
            metaObject.setValue("updateTime", LocalDateTime.now());
        }
        if (metaObject.hasSetter("recordedAt")) {
            metaObject.setValue("recordedAt", LocalDateTime.now());
        }
        if (metaObject.hasSetter("sentAt")) {
            metaObject.setValue("sentAt", LocalDateTime.now());
        }
        // In your JWT example, after the Token is successfully validated,
        // a UsernamePasswordAuthenticationToken object is created,
        // and the User object retrieved from Redis is passed as the principal.
        // Therefore, calling SecurityContextHolder.getContext().getAuthentication().getPrincipal()
        // returns this User object, which contains detailed user information (e.g., user ID, role, etc.)
        // for subsequent use in business logic.

        // This needs to be updated to specific user information, such as ID, etc.
        if (metaObject.hasSetter("createUser")) {
            metaObject.setValue("createUser", SecurityContextHolder.
                    getContext().
                    getAuthentication().getPrincipal());
        }
        if (metaObject.hasSetter("updateUser")) {
            metaObject.setValue("updateUser", SecurityContextHolder.
                    getContext().
                    getAuthentication().getPrincipal());
        }
    }

    /**
     * Update operation, auto-fill fields
     * @param metaObject
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("Automatically filling common fields [update]...");
        log.info(metaObject.toString());

        long id = Thread.currentThread().getId();
        log.info("Thread ID: {}", id);

        if (metaObject.hasSetter("updateTime")) {
            metaObject.setValue("updateTime", LocalDateTime.now());
        }

        if (metaObject.hasSetter("updateUser")) {
            metaObject.setValue("updateUser", SecurityContextHolder.
                    getContext().
                    getAuthentication().getPrincipal());
        }
    }
}

