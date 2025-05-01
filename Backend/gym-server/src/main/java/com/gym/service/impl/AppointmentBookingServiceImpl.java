package com.gym.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.dao.AppointmentAlternativeTrainerDao;
import com.gym.dao.AppointmentBookingDao;
import com.gym.dto.AppointmentBookingDTO;
import com.gym.dto.AppointmentDecisionDTO;
import com.gym.dto.AppointmentDecisionRejectDTO;
import com.gym.dto.ForceBookingDTO;
import com.gym.entity.*;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.service.*;
import com.gym.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.*;

@Service
@Slf4j
public class AppointmentBookingServiceImpl extends ServiceImpl<AppointmentBookingDao, AppointmentBooking>
        implements AppointmentBookingService {

    @Autowired
    private TrainerConnectRequestService trainerConnectRequestService;

    @Autowired
    private TrainerAvailabilityService trainerAvailabilityService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AppointmentBookingDao appointmentBookingDao;

    @Autowired
    private AppointmentAlternativeTrainerDao appointmentAlternativeTrainerDao;

    @Autowired
    private UserService userService;

    @Autowired
    private WorkoutPlanService workoutPlanService;

    //    @Autowired
//    private RedissonClient redissonClient;

    // using reddison client for distributed locking!!!
//    @Override
//    @Transactional
//    public void bookSession(AppointmentBookingDTO dto, Long memberId) {
//
//        LambdaQueryWrapper<TrainerConnectRequest> connectWrapper = new LambdaQueryWrapper<>();
//        connectWrapper.eq(TrainerConnectRequest::getMemberId, memberId)
//                .eq(TrainerConnectRequest::getTrainerId, dto.getTrainerId())
//                .eq(TrainerConnectRequest::getStatus, TrainerConnectRequest.RequestStatus.Accepted);
//        TrainerConnectRequest connection = trainerConnectRequestService.getOne(connectWrapper);
//        if (connection == null) {
//            throw new CustomException(ErrorCode.FORBIDDEN, "You are not connected with this trainer.");
//        }
//
//
//        TrainerAvailability availability = trainerAvailabilityService.getById(dto.getAvailabilityId());
//        if (availability == null) {
//            throw new CustomException(ErrorCode.NOT_FOUND, "Selected time slot not found.");
//        }
//        if (!availability.getTrainerId().equals(dto.getTrainerId())) {
//            throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot does not belong to the specified trainer.");
//        }
//        if (!availability.getStatus().equals(TrainerAvailability.AvailabilityStatus.Available)) {
//            throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot is not available.");
//        }
//        if (availability.getStartTime().isBefore(LocalDateTime.now().plusHours(1))) {
//            throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot is too soon; please select a time at least one hour from now.");
//        }
//
//
//        LocalDateTime newStartTime = availability.getStartTime();
//        LocalDateTime newEndTime = availability.getEndTime();
//        int conflictCount = appointmentBookingDao.countOverlappingAppointments(memberId, newStartTime, newEndTime);
//        if (conflictCount > 0) {
//            throw new CustomException(ErrorCode.BAD_REQUEST, "You already have an appointment in this time slot.");
//        }
//
//        // using redisson client for distributed locking
//        String lockKey = "appointment:lock:" + dto.getAvailabilityId();
//        RLock lock = redissonClient.getLock(lockKey);
//        lock.lock();
//        try {
//            TrainerAvailability currentAvailability = trainerAvailabilityService.getById(dto.getAvailabilityId());
//            if (currentAvailability == null || !currentAvailability.getStatus().equals(TrainerAvailability.AvailabilityStatus.Available)) {
//                throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot is no longer available.");
//            }
//
//            currentAvailability.setStatus(TrainerAvailability.AvailabilityStatus.Booked);
//            trainerAvailabilityService.updateById(currentAvailability);
//
//            AppointmentBooking booking = AppointmentBooking.builder()
//                    .memberId(memberId)
//                    .trainerId(dto.getTrainerId())
//                    .availabilityId(dto.getAvailabilityId())
//                    .projectName(dto.getProjectName())
//                    .description(dto.getDescription())
//                    .appointmentStatus(AppointmentBooking.AppointmentStatus.Pending)
//                    .build();
//            boolean inserted = this.save(booking);
//            if (!inserted) {
//                throw new CustomException(ErrorCode.BAD_REQUEST, "Failed to create appointment booking.");
//            }
//
//            Notification notification = Notification.builder()
//                    .userId(dto.getTrainerId())
//                    .title("New Session Appointment Request")
//                    .message("You have a new session appointment request for project: " + dto.getProjectName())
//                    .type(Notification.NotificationType.INFO)
//                    .isRead(false)
//                    .build();
//            notificationService.sendNotification(notification);
//
//            log.info("Appointment booking created successfully: Appointment id [{}] for member [{}] and trainer [{}]",
//                    booking.getAppointmentId(), memberId, dto.getTrainerId());
//        } finally {
//            lock.unlock();
//        }
//    }

    @Override
    @Transactional
    public void bookSession(AppointmentBookingDTO dto, Long memberId) {
        LambdaQueryWrapper<TrainerConnectRequest> connectWrapper = new LambdaQueryWrapper<>();
        connectWrapper.eq(TrainerConnectRequest::getMemberId, memberId)
                .eq(TrainerConnectRequest::getTrainerId, dto.getTrainerId())
                .eq(TrainerConnectRequest::getStatus, TrainerConnectRequest.RequestStatus.Accepted);
        TrainerConnectRequest connection = trainerConnectRequestService.getOne(connectWrapper);
        if (connection == null) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not connected with this trainer.");
        }

        TrainerAvailability availability = trainerAvailabilityService.getById(dto.getAvailabilityId());
        if (availability == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Selected time slot not found.");
        }
        if (!availability.getTrainerId().equals(dto.getTrainerId())) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot does not belong to the specified trainer.");
        }
        if (!availability.getStatus().equals(TrainerAvailability.AvailabilityStatus.Available)) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot is no longer available.");
        }
        if (availability.getStartTime().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "The selected time slot is too soon; please select a time at least one hour from now.");
        }

        LocalDateTime newStartTime = availability.getStartTime();
        LocalDateTime newEndTime = availability.getEndTime();
        int conflictCount = appointmentBookingDao.countOverlappingAppointments(memberId, newStartTime, newEndTime);
        if (conflictCount > 0) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "You already have an appointment in this time slot.");
        }


        AppointmentBooking booking = AppointmentBooking.builder()
                .memberId(memberId)
                .trainerId(dto.getTrainerId())
                .availabilityId(dto.getAvailabilityId())
                .projectName(dto.getProjectName())
                .description(dto.getDescription())
                .appointmentStatus(AppointmentBooking.AppointmentStatus.Pending)
                .build();
        boolean inserted = this.save(booking);
        if (!inserted) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Failed to create appointment booking.");
        }

        Notification notification = Notification.builder()
                .userId(dto.getTrainerId())
                .title("New Session Appointment Request")
                .message("You have a new session appointment request for project: " + dto.getProjectName())
                .type(Notification.NotificationType.INFO)
                .isRead(false)
                .build();
        notificationService.sendNotification(notification);

        log.info("Appointment booking created successfully: Appointment id [{}] for member [{}] and trainer [{}]",
                booking.getAppointmentId(), memberId, dto.getTrainerId());
    }

    @Override
    @Transactional
    public void acceptAppointment(AppointmentDecisionDTO dto, Long trainerId) {
        AppointmentBooking booking = this.getById(dto.getAppointmentId());
        if (booking == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Appointment booking not found.");
        }
        if (!booking.getTrainerId().equals(trainerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not authorized to process this appointment.");
        }
        if (booking.getAppointmentStatus() != AppointmentBooking.AppointmentStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "This appointment has already been processed.");
        }

        checkAndExpireIfNeeded(booking);

        booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Approved);
        boolean updated = this.updateById(booking);
        if (!updated) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Failed to update appointment booking.");
        }

        TrainerAvailability availability = trainerAvailabilityService.getById(booking.getAvailabilityId());
        if (availability != null) {
            availability.setStatus(TrainerAvailability.AvailabilityStatus.Booked);
            trainerAvailabilityService.updateById(availability);
        }
        Notification notification = Notification.builder()
                .userId(booking.getMemberId())
                .title("Appointment Approved")
                .message("Your appointment for project '" + booking.getProjectName() + "' has been approved by the trainer." +
                        (dto.getResponseMessage() != null ? " Note: " + dto.getResponseMessage() : ""))
                .type(Notification.NotificationType.ALERT)
                .isRead(false)
                .build();
        notificationService.sendNotification(notification);

        log.info("Trainer [{}] accepted appointment [{}]", trainerId, dto.getAppointmentId());
    }

    @Override
    @Transactional
    public void rejectAppointment(AppointmentDecisionRejectDTO dto, Long trainerId) {
        AppointmentBooking booking = this.getById(dto.getAppointmentId());
        if (booking == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Appointment booking not found.");
        }
        if (!booking.getTrainerId().equals(trainerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not authorized to process this appointment.");
        }
        if (booking.getAppointmentStatus() != AppointmentBooking.AppointmentStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "This appointment has already been processed.");
        }

        checkAndExpireIfNeeded(booking);

        booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Rejected);
        if (dto.getAlternativeTrainerId() != null) {
            AppointmentAlternativeTrainer alternative = AppointmentAlternativeTrainer.builder()
                    .appointmentId(dto.getAppointmentId())
                    .alternativeTrainerId(dto.getAlternativeTrainerId())
                    .alternativeTrainerName(dto.getAlternativeTrainerName())
                    .build();
            appointmentAlternativeTrainerDao.insert(alternative);
        }

        boolean updated = this.updateById(booking);
        if (!updated) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Failed to update appointment booking.");
        }

        TrainerAvailability availability = trainerAvailabilityService.getById(booking.getAvailabilityId());
        if (availability != null) {
            availability.setStatus(TrainerAvailability.AvailabilityStatus.Available);
            trainerAvailabilityService.updateById(availability);
        }

        Notification notification = Notification.builder()
                .userId(booking.getMemberId())
                .title("Appointment Rejected")
                .message("Your appointment for project '" + booking.getProjectName() + "' has been rejected by the trainer." +
                        (dto.getResponseMessage() != null ? " Note: " + dto.getResponseMessage() : "") +
                        " Alternative trainer: " + (dto.getAlternativeTrainerName() == null ? "None" : dto.getAlternativeTrainerName()))
                .type(Notification.NotificationType.INFO)
                .isRead(false)
                .build();
        notificationService.sendNotification(notification);

        log.info("Trainer [{}] rejected appointment [{}]", trainerId, dto.getAppointmentId());
    }

    @Override
    public List<PendingAppointmentVO> getPendingAppointmentsForTrainerWithTimes(Long trainerId) {
        LambdaQueryWrapper<AppointmentBooking> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AppointmentBooking::getTrainerId, trainerId)
                .eq(AppointmentBooking::getAppointmentStatus, AppointmentBooking.AppointmentStatus.Pending)
                .orderByAsc(AppointmentBooking::getCreateTime);
        List<AppointmentBooking> list = this.list(wrapper);

        List<AppointmentBooking> valid = new ArrayList<>();
        for (AppointmentBooking b : list) {
            try {
                checkAndExpireIfNeeded(b);
                valid.add(b);
            } catch (CustomException e) {
                log.info("Appointment [{}] expired.", b.getAppointmentId());
            }
        }
        if (valid.isEmpty()) {
            return Collections.emptyList();
        }

        LinkedHashSet<Long> memberIds = valid.stream()
                .map(AppointmentBooking::getMemberId)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Map<Long, String> nameMap = userService.listByIds(new ArrayList<>(memberIds))
                .stream()
                .collect(Collectors.toMap(User::getUserID, User::getName));

        List<PendingAppointmentVO> result = new ArrayList<>();
        for (AppointmentBooking b : valid) {
            TrainerAvailability slot = trainerAvailabilityService.getById(b.getAvailabilityId());
            if (slot == null) {
                continue;
            }
            result.add(PendingAppointmentVO.builder()
                    .appointmentId(b.getAppointmentId())
                    .memberId(b.getMemberId())
                    .memberName(nameMap.getOrDefault(b.getMemberId(), "Unknown"))
                    .projectName(b.getProjectName())
                    .description(b.getDescription())
                    .createdAt(b.getCreateTime())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .build());
        }
        return result;
    }

    private void checkAndExpireIfNeeded(AppointmentBooking booking) {
        TrainerAvailability availability = trainerAvailabilityService.getById(booking.getAvailabilityId());
        if (availability == null || availability.getStartTime().isBefore(LocalDateTime.now().plusHours(1))) {
            booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Expired);
            this.updateById(booking);
            Notification notification = Notification.builder()
                    .userId(booking.getMemberId())
                    .title("Appointment Expired")
                    .message("Your appointment request for project '" + booking.getProjectName() + "' has expired because the selected time slot is too close to the current time.")
                    .type(Notification.NotificationType.INFO)
                    .isRead(false)
                    .build();
            notificationService.sendNotification(notification);
            throw new CustomException(ErrorCode.BAD_REQUEST, "This appointment request has expired and cannot be processed.");
        }
    }

    @Override
    public Page<AppointmentBookingDetailVO> getUpcomingAppointmentsForMember(Long memberId, Page<AppointmentBookingDetailVO> page,String status) {
        expireOldPendingAppointments(memberId);
        updateCompletedAppointments(memberId);
        return baseMapper.selectUpcomingAppointmentsByMember(page, memberId,status);
    }


    private void expireOldPendingAppointments(Long memberId) {
        LambdaQueryWrapper<AppointmentBooking> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppointmentBooking::getMemberId, memberId)
                .eq(AppointmentBooking::getAppointmentStatus, AppointmentBooking.AppointmentStatus.Pending);
        List<AppointmentBooking> pendingList = this.list(queryWrapper);
        LocalDateTime cutoff = LocalDateTime.now().plusHours(1);
        for (AppointmentBooking booking : pendingList) {
            TrainerAvailability availability = trainerAvailabilityService.getById(booking.getAvailabilityId());
            if (availability == null || availability.getStartTime().isBefore(cutoff)) {
                booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Expired);
                this.updateById(booking);
                Notification notification = Notification.builder()
                        .userId(booking.getMemberId())
                        .title("Appointment Expired")
                        .message("Your appointment request for project '" + booking.getProjectName() + "' has expired due to insufficient lead time.")
                        .type(Notification.NotificationType.INFO)
                        .isRead(false)
                        .build();
                notificationService.sendNotification(notification);
            }
        }
    }

    private void updateCompletedAppointments(Long memberId) {
        LambdaQueryWrapper<AppointmentBooking> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppointmentBooking::getMemberId, memberId)
                .eq(AppointmentBooking::getAppointmentStatus, AppointmentBooking.AppointmentStatus.Approved);
        List<AppointmentBooking> approvedList = this.list(queryWrapper);
        for (AppointmentBooking booking : approvedList) {
            TrainerAvailability availability = trainerAvailabilityService.getById(booking.getAvailabilityId());
            if (availability != null && availability.getEndTime().isBefore(LocalDateTime.now())) {
                booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Completed);
                this.updateById(booking);
                Notification notification = Notification.builder()
                        .userId(booking.getMemberId())
                        .title("Appointment Completed")
                        .message("Your appointment for project '" + booking.getProjectName() + "' has been completed.")
                        .type(Notification.NotificationType.INFO)
                        .isRead(false)
                        .build();
                notificationService.sendNotification(notification);
            }
        }
    }

    @Override
    public Page<AppointmentBookingHistoryDetailVO> getHistoricalAppointmentsForMember(Long memberId, Page<AppointmentBookingHistoryDetailVO> page, String status) {
        return baseMapper.selectHistoricalAppointmentsByMember(page, memberId,status);
    }


    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, Long memberId) {
        AppointmentBooking booking = this.getById(appointmentId);
        if (booking == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Appointment booking not found.");
        }
        if (!booking.getMemberId().equals(memberId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not authorized to cancel this appointment.");
        }
        if (booking.getAppointmentStatus() == AppointmentBooking.AppointmentStatus.Pending) {
            booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Cancelled);
            boolean updated = this.updateById(booking);
            if (!updated) {
                throw new CustomException(ErrorCode.BAD_REQUEST, "Failed to cancel the appointment.");
            }
            TrainerAvailability availability = trainerAvailabilityService.getById(booking.getAvailabilityId());
            if (availability != null) {
                availability.setStatus(TrainerAvailability.AvailabilityStatus.Available);
                trainerAvailabilityService.updateById(availability);
            }

            Notification notification = Notification.builder()
                    .userId(booking.getTrainerId())
                    .title("Appointment Cancelled")
                    .message("The appointment request for project '" + booking.getProjectName() + "' has been cancelled by the member.")
                    .type(Notification.NotificationType.INFO)
                    .isRead(false)
                    .build();
            notificationService.sendNotification(notification);
            log.info("Member [{}] cancelled appointment [{}]", memberId, appointmentId);
        } else if (booking.getAppointmentStatus() == AppointmentBooking.AppointmentStatus.Approved) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Approved appointments cannot be cancelled directly. Please contact your trainer.");
        } else {
            throw new CustomException(ErrorCode.BAD_REQUEST, "This appointment cannot be cancelled.");
        }
    }

    @Override
    public DynamicAppointmentStatisticsVO getDynamicAppointmentStatisticsForMember(Long memberId, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Start date must be before or equal to end date.");
        }
        if (ChronoUnit.DAYS.between(startDate, endDate) > 30) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Date range should not exceed 30 days.");
        }

        List<DailyStatisticVO> dailyStats =
                appointmentBookingDao.selectDynamicStatisticsByMember(memberId, startDate, endDate);

        List<DailyStatisticVO> completeStats = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            DailyStatisticVO stat = dailyStats.stream()
                    .filter(ds -> ds.getDate().equals(currentDate))
                    .findFirst()
                    .orElse(DailyStatisticVO.builder().date(currentDate).hours(0.0).build());
            completeStats.add(stat);
        }

        return DynamicAppointmentStatisticsVO.builder()
                .dailyStatistics(completeStats)
                .build();
    }



    @Override
    public List<PendingAppointmentVO> getApprovedAppointmentsForTrainerWithTimes(Long trainerId) {
        List<AppointmentBooking> list = this.list(new LambdaQueryWrapper<AppointmentBooking>()
                .eq(AppointmentBooking::getTrainerId, trainerId)
                .eq(AppointmentBooking::getAppointmentStatus, AppointmentBooking.AppointmentStatus.Approved)
                .orderByAsc(AppointmentBooking::getCreateTime)
        );
        if (list.isEmpty()) {
            return Collections.emptyList();
        }

        LinkedHashSet<Long> memberIds = list.stream()
                .map(AppointmentBooking::getMemberId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        Map<Long, String> nameMap = userService.listByIds(new ArrayList<>(memberIds))
                .stream()
                .collect(Collectors.toMap(User::getUserID, User::getName));

        Set<Long> planIds = list.stream()
                .map(AppointmentBooking::getWorkoutPlanId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, WorkoutPlan> planMap = planIds.isEmpty()
                ? Collections.emptyMap()
                : workoutPlanService.listByIds(new ArrayList<>(planIds))
                .stream().collect(Collectors.toMap(WorkoutPlan::getPlanId, p -> p));

        List<PendingAppointmentVO> result = new ArrayList<>();
        for (AppointmentBooking b : list) {
            TrainerAvailability slot = trainerAvailabilityService.getById(b.getAvailabilityId());
            if (slot == null) continue;

            WorkoutPlan plan = (b.getWorkoutPlanId() != null ? planMap.get(b.getWorkoutPlanId()) : null);

            result.add(PendingAppointmentVO.builder()
                    .appointmentId(b.getAppointmentId())
                    .memberId(b.getMemberId())
                    .memberName(nameMap.getOrDefault(b.getMemberId(), "Unknown"))
                    .projectName(b.getProjectName())
                    .description(b.getDescription())
                    .createdAt(b.getCreateTime())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .workoutPlanId(b.getWorkoutPlanId())
                    .workoutPlanTitle(plan != null ? plan.getTitle() : null)
                    .workoutPlanContent(plan != null ? plan.getContent() : null)
                    .build());
        }
        return result;
    }

    @Override
    @Transactional
    public void completeAppointment(Long appointmentId, Long trainerId) {
        AppointmentBooking booking = this.getById(appointmentId);
        if (booking == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Appointment booking not found.");
        }
        if (!booking.getTrainerId().equals(trainerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not authorized to complete this appointment.");
        }
        if (booking.getAppointmentStatus() != AppointmentBooking.AppointmentStatus.Approved) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Only approved appointments can be marked as completed.");
        }
        booking.setAppointmentStatus(AppointmentBooking.AppointmentStatus.Completed);
        if (!this.updateById(booking)) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Failed to update appointment booking.");
        }
        log.info("Trainer [{}] completed appointment [{}]", trainerId, appointmentId);
    }

    @Override
    public List<MemberAppointmentsVO> getAllAppointmentsGroupedByMember(Long trainerId) {
        LambdaQueryWrapper<AppointmentBooking> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AppointmentBooking::getTrainerId, trainerId)
                .orderByAsc(AppointmentBooking::getMemberId)
                .orderByAsc(AppointmentBooking::getCreateTime);
        List<AppointmentBooking> all = this.list(wrapper);
        if (all.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Long, List<AppointmentBooking>> grouped = all.stream()
                .collect(Collectors.groupingBy(
                        AppointmentBooking::getMemberId,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));
        Set<Long> memberIds = grouped.keySet();
        Map<Long, String> nameMap = userService.listByIds(new ArrayList<>(memberIds))
                .stream()
                .collect(Collectors.toMap(User::getUserID, User::getName));

        List<MemberAppointmentsVO> result = new ArrayList<>();
        for (Map.Entry<Long, List<AppointmentBooking>> entry : grouped.entrySet()) {
            Long memberId = entry.getKey();
            String memberName = nameMap.getOrDefault(memberId, "Unknown");

            List<AppointmentWithTimeVO> voList = entry.getValue().stream().map(b -> {
                TrainerAvailability slot = trainerAvailabilityService.getById(b.getAvailabilityId());
                if (slot == null) {
                    throw new CustomException(
                            ErrorCode.BAD_REQUEST,
                            "TrainerAvailability not found for id " + b.getAvailabilityId()
                    );
                }
                return AppointmentWithTimeVO.builder()
                        .appointmentId(b.getAppointmentId())
                        .projectName(b.getProjectName())
                        .description(b.getDescription())
                        .appointmentStatus(b.getAppointmentStatus().name())
                        .createdAt(b.getCreateTime())
                        .startTime(slot.getStartTime())
                        .endTime(slot.getEndTime())
                        .build();
            }).collect(Collectors.toList());

            result.add(MemberAppointmentsVO.builder()
                    .memberId(memberId)
                    .memberName(memberName)
                    .appointments(voList)
                    .build()
            );
        }
        return result;
    }

    @Override
    public List<CompletedAppointmentVO> getCompletedAppointmentsForTrainer(Long trainerId) {
        LambdaQueryWrapper<AppointmentBooking> qw = new LambdaQueryWrapper<>();
        qw.eq(AppointmentBooking::getTrainerId, trainerId)
                .eq(AppointmentBooking::getAppointmentStatus, AppointmentBooking.AppointmentStatus.Completed)
                .orderByAsc(AppointmentBooking::getCreateTime);
        List<AppointmentBooking> list = this.list(qw);
        if (list.isEmpty()) {
            return new ArrayList<>();
        }

        Set<Long> memberIds = list.stream()
                .map(AppointmentBooking::getMemberId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        Map<Long, String> nameMap = userService.listByIds(new ArrayList<>(memberIds)).stream()
                .collect(Collectors.toMap(User::getUserID, User::getName));

        List<CompletedAppointmentVO> result = new ArrayList<>();
        for (AppointmentBooking ab : list) {
            TrainerAvailability slot = trainerAvailabilityService.getById(ab.getAvailabilityId());
            if (slot == null) {
                continue;
            }
            result.add(CompletedAppointmentVO.builder()
                    .appointmentId(ab.getAppointmentId())
                    .memberId(ab.getMemberId())
                    .memberName(nameMap.getOrDefault(ab.getMemberId(), "Unknown"))
                    .projectName(ab.getProjectName())
                    .description(ab.getDescription())
                    .createdAt(ab.getCreateTime())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .build());
        }
        return result;
    }

    @Override
    public DynamicAppointmentStatisticsVO getDynamicAppointmentStatisticsForTrainer(
            Long trainerId, LocalDate startDate, LocalDate endDate) {

        if (startDate.isAfter(endDate)) {
            throw new CustomException(ErrorCode.BAD_REQUEST,
                    "Start date must be before or equal to end date.");
        }
        if (ChronoUnit.DAYS.between(startDate, endDate) > 370) {
            throw new CustomException(ErrorCode.BAD_REQUEST,
                    "Date range should not exceed 370 days.");
        }

        List<DailyStatisticVO> stats =
                appointmentBookingDao.selectDynamicStatisticsByTrainer(
                        trainerId, startDate, endDate);

        List<DailyStatisticVO> complete = new ArrayList<>();
        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            final LocalDate cd = d;
            DailyStatisticVO dayStat = stats.stream()
                    .filter(s -> s.getDate().equals(cd))
                    .findFirst()
                    .orElse(DailyStatisticVO.builder()
                            .date(cd)
                            .hours(0.0)
                            .build());
            complete.add(dayStat);
        }

        return DynamicAppointmentStatisticsVO.builder()
                .dailyStatistics(complete)
                .build();
    }

    @Override
    @Transactional
    public void bindWorkoutPlan(Long trainerId, Long appointmentId, Long planId) {
        AppointmentBooking booking = getById(appointmentId);
        if (booking == null || !booking.getTrainerId().equals(trainerId))
            throw new CustomException(ErrorCode.FORBIDDEN, "No permission");

        WorkoutPlan plan = workoutPlanService.getById(planId);
        if (plan == null || !plan.getTrainerId().equals(trainerId))
            throw new CustomException(ErrorCode.BAD_REQUEST, "Plan not found or not yours");

        booking.setWorkoutPlanId(planId);
        updateById(booking);
    }

    @Override
    @Transactional
    public void forceBookSession(Long trainerId, ForceBookingDTO dto) {

        /* ---------- 1. Validate availability slot ---------- */
        TrainerAvailability slot = trainerAvailabilityService.getById(dto.getAvailabilityId());
        if (slot == null || !slot.getTrainerId().equals(trainerId)) {
            throw new CustomException(ErrorCode.NOT_FOUND, "The slot does not exist or does not belong to this trainer");
        }
        if (slot.getStatus() != TrainerAvailability.AvailabilityStatus.Available) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "The slot has already been booked");
        }

        /* ---------- 2. Validate trainer–member connection ---------- */
        if (!trainerConnectRequestService.isConnected(dto.getMemberId(), trainerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "The member has not been connected to the trainer");
        }

        /* ---------- 3. Create booking record (auto-approved) ---------- */
        AppointmentBooking booking = AppointmentBooking.builder()
                .memberId(dto.getMemberId())
                .trainerId(trainerId)
                .availabilityId(dto.getAvailabilityId())
                .projectName(
                        Optional.ofNullable(dto.getProjectName()).orElse("Private Session"))
                .description(dto.getDescription())
                .appointmentStatus(AppointmentBooking.AppointmentStatus.Approved)
                .build();
        this.save(booking);

        /* ---------- 4. Mark slot as booked ---------- */
        slot.setStatus(TrainerAvailability.AvailabilityStatus.Booked);
        trainerAvailabilityService.updateById(slot);

        /* ---------- 5. Notify the member ---------- */
        notificationService.sendNotification(Notification.builder()
                .userId(dto.getMemberId())
                .title("Session Confirmed")
                .message("Your trainer has scheduled a session on "
                        + slot.getStartTime() + " – " + slot.getEndTime()
                        + ". The booking is already confirmed.")
                .type(Notification.NotificationType.INFO)
                .isRead(false)
                .build());

        log.info("Force-booking completed | bookingId={}, trainerId={}, memberId={}",
                booking.getAppointmentId(), trainerId, dto.getMemberId());
    }
}

