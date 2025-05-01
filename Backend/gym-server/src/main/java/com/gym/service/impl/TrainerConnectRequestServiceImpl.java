package com.gym.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.dao.TrainerConnectRequestDao;
import com.gym.dto.TrainerConnectDecisionDTO;
import com.gym.dto.TrainerConnectRequestDTO;
import com.gym.entity.Notification;
import com.gym.entity.TrainerConnectRequest;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.service.NotificationService;
import com.gym.service.TrainerConnectRequestService;
import com.gym.service.UserService;
import com.gym.vo.ConnectedMemberVO;
import com.gym.vo.PendingConnectRequestVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.gym.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.LinkedHashSet;

@Service
@Slf4j
public class TrainerConnectRequestServiceImpl extends ServiceImpl<TrainerConnectRequestDao, TrainerConnectRequest>
        implements TrainerConnectRequestService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;   // new dependency

    // Determine if the current member is already connected with the specified trainer
    @Override
    public boolean isConnected(Long memberId, Long trainerId) {
        LambdaQueryWrapper<TrainerConnectRequest> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TrainerConnectRequest::getMemberId, memberId)
                .eq(TrainerConnectRequest::getTrainerId, trainerId)
                .eq(TrainerConnectRequest::getStatus, TrainerConnectRequest.RequestStatus.Accepted);
        return this.count(queryWrapper) > 0;
    }

    // Count the number of pending connection requests for the specified member
    @Override
    public int countPendingRequests(Long memberId) {
        LambdaQueryWrapper<TrainerConnectRequest> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TrainerConnectRequest::getMemberId, memberId)
                .eq(TrainerConnectRequest::getStatus, TrainerConnectRequest.RequestStatus.Pending);
        return this.count(queryWrapper);
    }

    // Member submits a connection request
    @Override
    public void submitConnectRequest(TrainerConnectRequestDTO dto, Long memberId) {
        TrainerConnectRequest request = TrainerConnectRequest.builder()
                .memberId(memberId)
                .trainerId(dto.getTrainerId())
                .status(TrainerConnectRequest.RequestStatus.Pending)
                .requestMessage(dto.getRequestMessage())
                .build();
        this.save(request);
        // Create and send a notification to the trainer
        Notification notification = Notification.builder()
                .userId(dto.getTrainerId())
                .title("New connection request")
                .message("You have a new connection request.")
                .type(Notification.NotificationType.INFO)
                .isRead(false)
                .build();
        notificationService.sendNotification(notification);
    }

    // Trainer accepts the connection request
    @Override
    public void acceptConnectRequest(TrainerConnectDecisionDTO dto, Long trainerId) {
        TrainerConnectRequest request = this.getById(dto.getRequestId());
        if (request == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Connect request not found.");
        }
        // Ensure the request belongs to the current trainer
        if (!request.getTrainerId().equals(trainerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not authorized to process this request.");
        }
        // The request must be in Pending status
        if (request.getStatus() != TrainerConnectRequest.RequestStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "This connect request has already been processed.");
        }
        // Update status and response message
        request.setStatus(TrainerConnectRequest.RequestStatus.Accepted);
        request.setResponseMessage(dto.getResponseMessage());
        boolean updateResult = this.updateById(request);
        if (!updateResult) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Unable to accept connect request.");
        }
        log.info("Trainer [{}] accepted connect request [{}]", trainerId, dto.getRequestId());

        // Create and send a notification to the requesting member
        Notification notification = Notification.builder()
                .userId(request.getMemberId())
                .title("Application result notification")
                .message("One of your trainer connection requests has been accepted.")
                .type(Notification.NotificationType.INFO)
                .isRead(false)
                .build();
        notificationService.sendNotification(notification);
    }

    // Trainer rejects the connection request
    @Override
    public void rejectConnectRequest(TrainerConnectDecisionDTO dto, Long trainerId) {
        TrainerConnectRequest request = this.getById(dto.getRequestId());
        if (request == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Connect request not found.");
        }
        // Ensure the request belongs to the current trainer
        if (!request.getTrainerId().equals(trainerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN, "You are not authorized to process this request.");
        }
        // The request must be in Pending status
        if (request.getStatus() != TrainerConnectRequest.RequestStatus.Pending) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "This connect request has already been processed.");
        }
        // Update status and response message
        request.setStatus(TrainerConnectRequest.RequestStatus.Rejected);
        request.setResponseMessage(dto.getResponseMessage());
        boolean updateResult = this.updateById(request);
        if (!updateResult) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Unable to reject connect request.");
        }
        log.info("Trainer [{}] rejected connect request [{}]", trainerId, dto.getRequestId());

        // Create and send a notification to the requesting member
        Notification notification = Notification.builder()
                .userId(request.getMemberId())
                .title("Application result notification")
                .message("One of your trainer connection requests has been rejected.")
                .type(Notification.NotificationType.INFO)
                .isRead(false)
                .build();
        notificationService.sendNotification(notification);
    }

    @Override
    public List<PendingConnectRequestVO> getPendingConnectRequestsForTrainer(Long trainerId) {

        // (1) Fetch raw pending connection requests
        LambdaQueryWrapper<TrainerConnectRequest> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TrainerConnectRequest::getTrainerId, trainerId)
                .eq(TrainerConnectRequest::getStatus, TrainerConnectRequest.RequestStatus.Pending)
                .orderByAsc(TrainerConnectRequest::getCreateTime);

        List<TrainerConnectRequest> requests = this.list(wrapper);
        if (requests.isEmpty()) {
            return new ArrayList<>();
        }

        // (2) Batch load member names
        Set<Long> memberIds = requests.stream()
                .map(TrainerConnectRequest::getMemberId)
                .collect(Collectors.toSet());

        Map<Long, String> nameMap = userService.listByIds(memberIds).stream()
                .collect(Collectors.toMap(User::getUserID, User::getName));

        // (3) Map entities to VO objects
        return requests.stream()
                .map(r -> PendingConnectRequestVO.builder()
                        .requestId(r.getRequestId())
                        .memberId(r.getMemberId())
                        .memberName(nameMap.getOrDefault(r.getMemberId(), "Unknown"))
                        .requestMessage(r.getRequestMessage())
                        .createdAt(r.getCreateTime())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ConnectedMemberVO> listConnectedMembers(Long trainerId) {
        // 1. Retrieve all Accepted connection records (including creation time)
        LambdaQueryWrapper<TrainerConnectRequest> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TrainerConnectRequest::getTrainerId, trainerId)
                .eq(TrainerConnectRequest::getStatus, TrainerConnectRequest.RequestStatus.Accepted)
                .orderByAsc(TrainerConnectRequest::getCreateTime);
        List<TrainerConnectRequest> accepted = this.list(wrapper);
        if (accepted.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. Deduplicate and collect member IDs
        LinkedHashSet<Long> memberIds = accepted.stream()
                .map(TrainerConnectRequest::getMemberId)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        // 3. Batch fetch User entities for members
        List<User> users = userService.listByIds(memberIds);
        Map<Long, User> userMap = users.stream()
                .collect(Collectors.toMap(User::getUserID, u -> u));

        // 4. Construct the VO list
        List<ConnectedMemberVO> result = new ArrayList<>();
        for (Long memberId : memberIds) {
            User u = userMap.get(memberId);
            String name  = (u != null ? u.getName() : "Unknown");
            String email = (u != null ? u.getEmail() : null);
            // Find the creation time from the corresponding connection record
            LocalDateTime t = accepted.stream()
                    .filter(r -> r.getMemberId().equals(memberId))
                    .findFirst()
                    .map(TrainerConnectRequest::getCreateTime)
                    .orElse(null);

            result.add(ConnectedMemberVO.builder()
                    .memberId(memberId)
                    .memberName(name)
                    .memberEmail(email)
                    .connectTime(t)
                    .build());
        }
        return result;
    }

}

