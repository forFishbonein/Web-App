package com.gym.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.dao.TrainerProfileDao;
import com.gym.dao.UserDao;
import com.gym.dto.TrainerProfileQuery;
import com.gym.entity.TrainerConnectRequest;
import com.gym.entity.TrainerProfile;
import com.gym.entity.User;
import com.gym.enumeration.ErrorCode;
import com.gym.exception.CustomException;
import com.gym.service.TrainerConnectRequestService;
import com.gym.service.TrainerProfileService;
import com.gym.service.UserService;
import com.gym.util.SecurityUtils;
import com.gym.vo.TrainerAllProfile;
import com.gym.vo.TrainerProfileVO;
import com.gym.vo.UserProfileResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TrainerProfileServiceImpl extends ServiceImpl<TrainerProfileDao, TrainerProfile>
        implements TrainerProfileService {

    @Autowired
    UserService userService;

    @Autowired
    private TrainerProfileDao trainerProfileDao;

    /**
     * Create a default TrainerProfile record for a given trainer user.
     * All fields are initialized to empty (or 0), and trainers can complete them later via the profile page.
     *
     * @param userId ID of the trainer user
     * @param name   Name of the trainer user
     */
    @Override
    public void createDefaultTrainerProfile(Long userId, String name) {
        // Use builder to initialize default values
        TrainerProfile trainerProfile = TrainerProfile.builder()
                .userId(userId)
                .name(name)
                .certifications("")
                .specializations("")
                .yearsOfExperience(0)
                .biography("")
                .workplace("")
                .build();
        // Save the record to the database
        this.save(trainerProfile);
    }

    // Query the trainer's profile along with basic user information
    @Override
    public TrainerAllProfile getTrainerAllProfile(Long currentUserId) {
        // Query the User table for the given user ID, selecting only necessary fields
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(User::getName, User::getDateOfBirth, User::getAddress, User::getEmail)
                .eq(User::getUserID, currentUserId);
        User user = userService.getOne(queryWrapper);

        if (user == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "User not found.");
        }
        // Query the TrainerProfile table for the given user ID; userId is a foreign key in the profile table
        LambdaQueryWrapper<TrainerProfile> queryWrapper2 = new LambdaQueryWrapper<>();
        queryWrapper2.eq(TrainerProfile::getUserId, currentUserId);
        TrainerProfile trainerProfile = this.getOne(queryWrapper2);
        if (trainerProfile == null) {
            throw new CustomException(ErrorCode.NOT_FOUND, "Trainer profile not found.");
        }

        // Build and return the TrainerAllProfile object
        return TrainerAllProfile.builder()
                .trainerProfile(trainerProfile)
                .dateOfBirth(user.getDateOfBirth())  // Set additional profile fields
                .address(user.getAddress())
                .email(user.getEmail())
                .build();                             // Construct final DTO
    }

    @Override
    public Page<TrainerProfileVO> listTrainers(TrainerProfileQuery query) {
        // Get the current member's ID (the logged-in user)
        Long currentMemberId = SecurityUtils.getCurrentUserId();
        if (currentMemberId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "User is not authenticated or session is invalid.");
        }

        // Pagination works via SQL LIMIT and OFFSET
        // 1. Construct the pagination object (default to page 1, 10 records per page; adjust as needed)
        Page<TrainerProfile> page = new Page<>(query.getPage(), query.getPageSize());
        // Use custom SQL for LEFT JOIN to include connect status with members
        Page<TrainerProfileVO> voPage = trainerProfileDao.selectTrainersWithConnectStatus(
                page, query, currentMemberId);
        return voPage;
    }
}

