package com.gym.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gym.dto.SpecializationDTO;
import com.gym.entity.Specializations;

import java.util.List;

public interface SpecializationsService extends IService<Specializations> {

    Specializations addSpecialization(SpecializationDTO dto);

    void deleteSpecialization(Long specializationId);

    List<Specializations> listAllSpecializations();
}
