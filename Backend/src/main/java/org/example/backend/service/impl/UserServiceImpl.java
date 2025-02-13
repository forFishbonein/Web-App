package org.example.backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.backend.dao.UserDao;
import org.example.backend.domain.User;
import org.example.backend.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl extends ServiceImpl<UserDao, User> implements UserService {

    @Override
    public User createUser(User user) {
        // Insert data using MyBatis-Plus's BaseMapper
        baseMapper.insert(user);
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        // Query all users; passing null indicates no conditions
        return baseMapper.selectList(null);
    }

    @Override
    public User getUserById(Long userID) {
        // Query user by primary key
        return baseMapper.selectById(userID);
    }
}
