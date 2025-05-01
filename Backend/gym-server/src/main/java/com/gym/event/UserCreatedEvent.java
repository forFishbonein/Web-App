package com.gym.event;

import com.gym.entity.User;
import org.springframework.context.ApplicationEvent;

// define an event class that extends ApplicationEvent
public class UserCreatedEvent extends ApplicationEvent {
    private final User user;
    public UserCreatedEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
    public User getUser() {
        return user;
    }
}

