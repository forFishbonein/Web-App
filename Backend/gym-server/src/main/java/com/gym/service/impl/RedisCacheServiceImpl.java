package com.gym.service.impl;

import com.gym.bloomFilter.BloomFilterUtil;
import com.gym.dao.UserDao;
import com.gym.dto.redis.UserCacheDTO;
import com.gym.entity.User;
import com.gym.service.RedisCacheService;
import com.gym.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Redis cache service for user data.
 * Implements:
 * 1. Using a Bloom filter to prevent cache penetration
 * 2. Using distributed locks and random TTL to prevent cache avalanche
 */
@Service
@Slf4j
public class RedisCacheServiceImpl implements RedisCacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Directly inject UserDao (or UserMapper) instead of UserService
    @Autowired
    private UserDao userDao;

    @Autowired
    private BloomFilterUtil bloomFilterUtil;

    /**
     * Retrieve user information, while preventing cache penetration and cache avalanche
     */
    public User getUser(Long userId) {
        // Use Bloom filter to check existence of user data
        if (!bloomFilterUtil.mightContainUser(userId)) {
            return null;
        }
        String key = "USER:" + userId;
        Object cacheObj = redisTemplate.opsForValue().get(key);
        if (cacheObj != null) {
            if (cacheObj instanceof NullValue) {
                return null;
            }
            UserCacheDTO dto = (UserCacheDTO) cacheObj;
            return dto.toEntity();
        }
        // Cache miss: use a distributed lock to avoid many concurrent DB queries
        String lockKey = "LOCK:USER:" + userId;
        String lockValue = UUID.randomUUID().toString();
        // This uses setIfAbsent (SETNX)
        boolean locked = tryLock(lockKey, lockValue, 10);
        if (locked) {
            try {
                // Double-check the cache after acquiring the lock
                cacheObj = redisTemplate.opsForValue().get(key);
                if (cacheObj != null) {
                    if (cacheObj instanceof NullValue) {
                        return null;
                    }
                    UserCacheDTO dto = (UserCacheDTO) cacheObj;
                    return dto.toEntity();
                }
                // Query the database
                User user = userDao.selectById(userId);
                if (user != null) {
                    updateUser(user);
                    return user;
                } else {
                    // Not found in DB: cache a NullValue with short TTL to prevent cache penetration
                    redisTemplate.opsForValue().set(key, new NullValue(), 300, TimeUnit.SECONDS);
                    return null;
                }
            } finally {
                unlock(lockKey, lockValue);
            }
        } else {
            // Could not acquire lock: retry after a short delay
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return getUser(userId);
        }
    }

    // Update the cache entry
    public void updateUser(User user) {
        int baseTtl = 600; // Base 10 minutes
        int randomExtra = new Random().nextInt(60); // 0–59 seconds random extra
        int ttl = baseTtl + randomExtra;
        String key = "USER:" + user.getUserID();
        redisTemplate.opsForValue().set(key, UserCacheDTO.fromEntity(user), ttl, TimeUnit.SECONDS);
    }

    // Delete the cache entry, e.g., after data update
    public void deleteUser(Long userId) {
        String key = "USER:" + userId;
        redisTemplate.delete(key);
    }

    // Simple Redis-based distributed lock implementation
    private boolean tryLock(String lockKey, String lockValue, int expireSeconds) {
        Boolean success = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue, expireSeconds, TimeUnit.SECONDS);
        return success != null && success;
    }

    private void unlock(String lockKey, String lockValue) {
        Object value = redisTemplate.opsForValue().get(lockKey);
        if (lockValue.equals(value)) {
            redisTemplate.delete(lockKey);
        }
    }

    // Marker class for caching null values
    public static class NullValue implements Serializable {}
}
