package com.gym.dto.redis;

import com.gym.entity.User;
import lombok.*;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserCacheDTO implements Serializable {
    private Long userID;
    private String name;
    private String email;
    private User.Role role;
    private User.AccountStatus accountStatus;

    public static UserCacheDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }
        UserCacheDTO dto = new UserCacheDTO();
        dto.setUserID(user.getUserID());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAccountStatus(user.getAccountStatus());
        return dto;
    }

    public User toEntity() {
        User user = new User();
        user.setUserID(this.getUserID());
        user.setName(this.getName());
        user.setEmail(this.getEmail());
        user.setRole(this.getRole());
        user.setAccountStatus(this.getAccountStatus());
        return user;
    }
}
