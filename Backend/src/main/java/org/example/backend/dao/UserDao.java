package org.example.backend.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.backend.domain.User;

@Mapper
public interface UserDao extends BaseMapper<User> {
}
