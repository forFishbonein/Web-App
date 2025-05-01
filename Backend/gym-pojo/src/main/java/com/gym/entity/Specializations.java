package com.gym.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@TableName("specializations")
public class Specializations {
    @TableId(value = "specialization_id", type = IdType.AUTO)
    private Long specializationId;

    @TableField("description")
    private String description;
}
