package com.gym.bloomFilter;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import com.gym.dao.UserDao;
import com.gym.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import com.gym.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BloomFilterUtil {

    // Used only for preventing cache penetration of user data (USER:xxx)
    private BloomFilter<Long> userBloomFilter;

    @Autowired
    private UserDao userDao;  // Directly access the database

    @PostConstruct
    public void init() {
        // Initialize the Bloom filter with parameters set based on actual requirements (expected number of elements, false positive rate)
        userBloomFilter = BloomFilter.create(Funnels.longFunnel(), 100000, 0.01);

        // Use userDao directly to query all user IDs instead of userService
        List<Long> allUserIds = userDao.selectObjs(
                new LambdaQueryWrapper<User>().select(User::getUserID)
        ).stream().map(obj -> Long.valueOf(obj.toString())).collect(Collectors.toList());

        for (Long id : allUserIds) {
            userBloomFilter.put(id);
        }
    }

    public boolean mightContainUser(Long userId) {
        return userBloomFilter.mightContain(userId);
    }

    public void addUserToBloomFilter(Long userId) {
        userBloomFilter.put(userId);
    }
}
