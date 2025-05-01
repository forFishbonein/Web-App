package com.gym.vo;

import com.gym.entity.AppointmentBooking;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class MemberAppointmentsVO {
    private Long memberId;
    private String memberName;
    private List<AppointmentWithTimeVO> appointments;
}
