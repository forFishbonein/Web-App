package com.gym.service;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gym.dto.SignupRequest;
import com.gym.dto.UserProfileDTO;
import com.gym.dto.VerifyCodeRequest;
import com.gym.entity.Specializations;
import com.gym.entity.User;
import com.gym.vo.TrainerBasicInfoVO;

import java.util.List;

public interface UserService extends IService<User> {
    void sendSignupVerification(SignupRequest signupRequest);
    void verifySignupCode(VerifyCodeRequest verifyReq);

    void updateUserProfile(Long userId, UserProfileDTO userProfileDTO);

    User createUser(User user);
    User getUserById(Long userID);
    User getByEmail(String email);

    List<Specializations> listSpecializations();

    List<TrainerBasicInfoVO> listOtherTrainersBasicInfo(Long excludeTrainerId);

    Page<User> getPendingUsers(Page<User> page);

    Page<User> listUsers(int page, int pageSize, String role);

    void updateSubscription(Long userId, boolean subscribe);
}

