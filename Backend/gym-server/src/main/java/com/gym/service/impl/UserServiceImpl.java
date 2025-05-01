package com.gym.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.bloomFilter.BloomFilterUtil;
import com.gym.dao.SpecializationsDao;
import com.gym.dao.UserDao;
import com.gym.dto.PendingVerification;
import com.gym.dto.SignupRequest;
import com.gym.dto.UserProfileDTO;
import com.gym.dto.VerifyCodeRequest;
import com.gym.entity.Specializations;
import com.gym.entity.User;
import com.gym.enumeration.ErrorCode;
import com.gym.event.UserCreatedEvent;
import com.gym.exception.CustomException;
import com.gym.service.MailService;
import com.gym.service.UserService;
import com.gym.vo.TrainerBasicInfoVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserDao, User> implements UserService {

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private RedisCacheServiceImpl redisCacheService;

    @Autowired
    private BloomFilterUtil bloomFilterUtil;

    @Autowired
    private SpecializationsDao Specializationsdao;

    @Override
    public void sendSignupVerification(SignupRequest signupRequest) {
        // 1. Validate role, forbid registering as admin account
        if (signupRequest.getRole() == User.Role.admin) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "You do not have permission to register as an admin.");
        }
        // 2. Check if the email is already registered
        User existing = this.getByEmail(signupRequest.getEmail());
        if (existing != null) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Email is already registered.");
        }
        // 3. Generate verification code
        String code = generateRandomCode();
        PendingVerification pv = new PendingVerification();
        pv.setRequest(signupRequest);
        pv.setVerificationCode(code);
        pv.setCreateTime(System.currentTimeMillis());
        // 4. Save to Redis (valid for 5 minutes)
        // Use String type to store objects as long as RedisTemplate is configured with appropriate serializer
        // (e.g. JSON serializer), so the object will be serialized to string for storage.
        String redisKey = "SIGNUP_PENDING_" + signupRequest.getEmail();
        redisTemplate.opsForValue().set(redisKey, pv, 5, TimeUnit.MINUTES);
        // 5. Send verification code email
        mailService.sendVerificationCode(signupRequest.getEmail(), code);
    }

    @Override
    public void verifySignupCode(VerifyCodeRequest verifyReq) {
        String email = verifyReq.getEmail();
        String inputCode = verifyReq.getCode();
        String redisKey = "SIGNUP_PENDING_" + email;
        PendingVerification pv = (PendingVerification) redisTemplate.opsForValue().get(redisKey);
        if (pv == null) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Verification code expired or not found. Please sign up again.");
        }
        if (!pv.getVerificationCode().equals(inputCode)) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Invalid verification code. Please try again.");
        }
        // Convert the registration request into a User entity and persist to database
        SignupRequest req = pv.getRequest();
        User newUser = convertSignupRequestToUser(req);
        createUser(newUser);
        // Publish event to notify listeners; if user is a Trainer, create TrainerProfile
        eventPublisher.publishEvent(new UserCreatedEvent(this, newUser));

        // Cleanup PendingVerification information from Redis
        redisTemplate.delete(redisKey);
        // Update cache and Bloom filter
        // No need to update cache explicitly; directly update the Bloom filter
        redisCacheService.updateUser(newUser);
        bloomFilterUtil.addUserToBloomFilter(newUser.getUserID());
    }

    @Override
    public void updateUserProfile(Long userId, UserProfileDTO userProfileDTO) {
        // Use MyBatis Plus's LambdaUpdateWrapper to encapsulate update logic
        LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(User::getUserID, userId)
                .set(User::getName, userProfileDTO.getName())
                .set(User::getAddress, userProfileDTO.getAddress())
                .set(User::getDateOfBirth, userProfileDTO.getDateOfBirth());
        boolean updateResult = this.update(updateWrapper);
        if (!updateResult) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Update failed: User profile may not exist.");
        }
        log.info("User [{}] profile updated successfully", userId);
    }

    @Override
    public List<TrainerBasicInfoVO> listOtherTrainersBasicInfo(Long excludeTrainerId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role", User.Role.trainer)                       // only trainers
                .ne(excludeTrainerId != null, "user_id", excludeTrainerId) // exclude self
                .select("user_id", "name");                          // select only needed columns

        List<User> trainers = baseMapper.selectList(queryWrapper);

        return trainers.stream()
                .map(u -> TrainerBasicInfoVO.builder()
                        .trainerId(u.getUserID())
                        .name(u.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public Page<User> getPendingUsers(Page<User> page) {
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("account_status", User.AccountStatus.Pending)
                .orderByAsc("created_at");              // oldest first
        return this.page(page, wrapper);
    }

    // Convert SignupRequest to User entity
    private User convertSignupRequestToUser(SignupRequest req) {
        User newUser = new User();
        newUser.setEmail(req.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        newUser.setName(req.getName());
        newUser.setAddress(req.getAddress());
        newUser.setDateOfBirth(req.getDateOfBirth());
        newUser.setAccountStatus(User.AccountStatus.Pending);
        newUser.setRole(req.getRole());
        return newUser;
    }

    // Generate a six-digit random verification code
    private String generateRandomCode() {
        int code = (int) ((Math.random() * 9 + 1) * 100000);
        return String.valueOf(code);
    }

    @Override
    public List<Specializations> listSpecializations() {
        // Use MyBatis-Plus's selectList(null) to query all records
        return Specializationsdao.selectList(null);
    }

    @Override
    public User createUser(User user) {
        baseMapper.insert(user);
        return user;
    }

    @Override
    public User getUserById(Long userID) {
        return baseMapper.selectById(userID);
    }

    @Override
    public User getByEmail(String email) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public Page<User> listUsers(int page, int pageSize, String role) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();

        if (role != null) {
            try {
                User.Role r = User.Role.valueOf(role);
                if (r == User.Role.admin) {
                    throw new IllegalArgumentException("Cannot query admin here");
                }
                qw.eq(User::getRole, r);
            } catch (IllegalArgumentException ex) {
                throw new CustomException(ErrorCode.BAD_REQUEST,
                        "Invalid role parameter: must be 'member' or 'trainer'");
            }
        } else {
            // By default query members + trainers
            qw.in(User::getRole, User.Role.member, User.Role.trainer);
        }

        // Order by creation time ascending
        qw.orderByAsc(User::getCreateTime);

        Page<User> pageObj = new Page<>(page, pageSize);
        return this.page(pageObj, qw);
    }
}