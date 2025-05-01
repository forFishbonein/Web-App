package com.gym.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@TableName("fitness_centres")
public class FitnessCentre implements Serializable {

    @TableId(value = "centre_id", type = IdType.AUTO)
    private Long centreId;

    @TableField("name")
    private String name;

    @TableField("address")
    private String address;

    /**
     * Latitude/longitude can use Double or BigDecimal.
     * BigDecimal is chosen here to avoid floating-point precision issues.
     */
    @TableField("latitude")
    private BigDecimal latitude;

    @TableField("longitude")
    private BigDecimal longitude;

    @TableField("contact_info")
    private String contactInfo;

    @TableField("description")
    private String description;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
