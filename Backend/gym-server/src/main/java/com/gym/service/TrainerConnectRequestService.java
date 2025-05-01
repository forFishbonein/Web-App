package com.gym.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gym.dto.TrainerConnectDecisionDTO;
import com.gym.dto.TrainerConnectRequestDTO;
import com.gym.entity.TrainerConnectRequest;
import com.gym.vo.ConnectedMemberVO;
import com.gym.vo.PendingConnectRequestVO;

import java.util.List;

public interface TrainerConnectRequestService extends IService<TrainerConnectRequest> {
    int countPendingRequests(Long memberId);

    void submitConnectRequest(TrainerConnectRequestDTO dto, Long memberId);

    void acceptConnectRequest(TrainerConnectDecisionDTO dto, Long trainerId);

    void rejectConnectRequest(TrainerConnectDecisionDTO dto, Long trainerId);

    boolean isConnected(Long memberId, Long trainerId);

    List<PendingConnectRequestVO> getPendingConnectRequestsForTrainer(Long trainerId);

    List<ConnectedMemberVO> listConnectedMembers(Long trainerId);
}

