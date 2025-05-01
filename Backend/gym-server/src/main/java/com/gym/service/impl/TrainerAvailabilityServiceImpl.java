package com.gym.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.dao.AppointmentBookingDao;
import com.gym.dao.TrainerAvailabilityDao;
import com.gym.dto.AvailabilitySlotDTO;
import com.gym.entity.AppointmentBooking;
import com.gym.entity.TrainerAvailability;
import com.gym.service.TrainerAvailabilityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TrainerAvailabilityServiceImpl extends ServiceImpl<TrainerAvailabilityDao, TrainerAvailability>
        implements TrainerAvailabilityService {

    /**
     * Instructors can maintain availability slots up to 7 days into the future.
     */
    private static final int RANGE_DAYS = 7;

    @Override
    @Transactional
    public void updateAvailability(Long trainerId, List<AvailabilitySlotDTO> frontList) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime limit = now.plusDays(RANGE_DAYS);

        /* ---------- 1. Filter out invalid slots ---------- */
        List<AvailabilitySlotDTO> valid = frontList.stream()
                .filter(s -> s.getStartTime() != null && s.getEndTime() != null)
                .filter(s -> !s.getStartTime().isBefore(now)        // start >= now
                        && !s.getEndTime().isAfter(limit)            // end <= now + 7 days
                        &&  s.getEndTime().isAfter(s.getStartTime()))// end > start
                .collect(Collectors.toList());
        if (valid.isEmpty()) {
            log.info("Trainer[{}] availability update skipped – no valid slots.", trainerId);
            return;
        }

        /* ---------- 2. Query existing slots within the next 7 days ---------- */
        List<TrainerAvailability> dbSlots = lambdaQuery()
                .eq(TrainerAvailability::getTrainerId, trainerId)
                .ge(TrainerAvailability::getStartTime, now)
                .le(TrainerAvailability::getEndTime,   limit)
                .list();

        // Use "start_end" string as a unique key to avoid duplicate inserts
        Set<String> dbKeys = dbSlots.stream()
                .map(v -> v.getStartTime() + "_" + v.getEndTime())
                .collect(Collectors.toSet());

        /* ---------- 3. Insert only new slots ---------- */
        List<TrainerAvailability> toInsert = valid.stream()
                .filter(s -> s.getAvailabilityId() == null)                // marked new by frontend
                .filter(s -> !dbKeys.contains(s.getStartTime() + "_" + s.getEndTime())) // not already in DB
                .map(s -> TrainerAvailability.builder()
                        .trainerId(trainerId)
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .status(TrainerAvailability.AvailabilityStatus.Available)
                        .build())
                .collect(Collectors.toList());
        if (!toInsert.isEmpty()) {
            saveBatch(toInsert);
        }
        log.info("Trainer[{}] availability add-only ⇒ inserted {} slots", trainerId, toInsert.size());
    }

    /**
     * Retrieve all future availability slots for a trainer, including booked and unavailable ones (none currently unavailable).
     */
    @Override
    public List<TrainerAvailability> getFutureAvailability(Long trainerId) {
        LocalDateTime now = LocalDateTime.now();
        LambdaQueryWrapper<TrainerAvailability> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TrainerAvailability::getTrainerId, trainerId)
                .ge(TrainerAvailability::getStartTime, now)
                .orderByAsc(TrainerAvailability::getStartTime);
        return this.list(queryWrapper);
    }

    @Override
    public List<AvailabilitySlotDTO> getAvailableSlots(Long trainerId) {
        // Calculate cutoff time: now + 1 hour buffer
        LocalDateTime cutoff = LocalDateTime.now().plusHours(1);
        LambdaQueryWrapper<TrainerAvailability> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TrainerAvailability::getTrainerId, trainerId)
                .eq(TrainerAvailability::getStatus, TrainerAvailability.AvailabilityStatus.Available)
                .ge(TrainerAvailability::getStartTime, cutoff)
                .orderByAsc(TrainerAvailability::getStartTime)
                // select only availabilityId, start_time, and end_time
                .select(TrainerAvailability::getAvailabilityId,
                        TrainerAvailability::getStartTime,
                        TrainerAvailability::getEndTime);

        List<TrainerAvailability> availabilityList = this.list(queryWrapper);
        return availabilityList.stream()
                .map(item -> AvailabilitySlotDTO.builder()
                        .availabilityId(item.getAvailabilityId())
                        .startTime(item.getStartTime())
                        .endTime(item.getEndTime())
                        .build())
                .collect(Collectors.toList());
    }

}

