package com.gym.util;


import com.gym.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;

public class UserRoleUtil {

    /**
     * Convert custom role enums to Security-recognizable "ROLE_xxx"
     */
    public static List<SimpleGrantedAuthority> buildAuthorities(User.Role role) {
        // Example: Admin -> ROLE_Admin
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}
