package org.example.backend.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
@TableName("users")
public class User implements Serializable {

    @TableId(value = "user_id", type = IdType.AUTO)
    private Long userID;

    @TableField("name")
    private String name;

    @TableField("date_of_birth")
    private Date dateOfBirth;

    @TableField("address")
    private String address;

    @TableField("email")
    private String email;

    @TableField("password_hash")
    private String passwordHash;

    @TableField("role")
    private Role role;

    @TableField("account_status")
    private AccountStatus accountStatus = AccountStatus.Pending;

    @TableField("email_verified")
    private Boolean emailVerified = false;

    @TableField("created_at")
    private Date createdAt;

    @TableField("updated_at")
    private Date updatedAt;

    public enum Role {
        Member, Trainer, Admin
    }

    public enum AccountStatus {
        Pending, Approved, Suspended
    }
}
