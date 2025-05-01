package com.gym.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gym.dto.AvailabilitySlotDTO;
import com.gym.entity.TrainerAvailability;

import java.util.List;

public interface TrainerAvailabilityService extends IService<TrainerAvailability> {
    /**
     * Updates the availability of a specific trainer. This method will delete all existing
     * availability (or future availability) of the trainer and then batch insert the new
     * time slots provided by the frontend.
     *
     * @param trainerId         The user ID of the trainer
     * @param availabilitySlots The list of availability time slots provided by the frontend
     */
    void updateAvailability(Long trainerId, List<AvailabilitySlotDTO> availabilitySlots);

    /**
     * Retrieves all time slots (including Available, Booked, and Unavailable) of a specific
     * trainer starting from the current time.
     *
     * @param trainerId The user ID of the trainer
     * @return A list of time slots
     */
    List<TrainerAvailability> getFutureAvailability(Long trainerId);


    /**
     * Retrieves all available time slots (status: Available) of a specific trainer starting
     * from the current time.
     *
     * @param trainerId The user ID of the trainer
     * @return A list of available time slots
     */
    List<AvailabilitySlotDTO> getAvailableSlots(Long trainerId);
}

