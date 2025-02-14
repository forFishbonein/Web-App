package org.example.backend.service;

import org.example.backend.domain.User;
import java.util.List;

public interface UserService {
    /**
     * Create a user
     * @param user User information
     * @return The created user object
     */
    User createUser(User user);

    /**
     * Retrieve the list of all users
     * @return List of users
     */
    List<User> getAllUsers();

    /**
     * Retrieve a user by user ID
     * @param userID The user ID
     * @return The user object; returns null if not found
     */
    User getUserById(Long userID);
}
