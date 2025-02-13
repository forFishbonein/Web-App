package org.example.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.common.RestResult;
import org.example.backend.domain.User;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Controller
 * A simple implementation of APIs for creating a user, listing all users, and fetching a user by ID,
 * used to test if the database is functioning correctly.
 */
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Create a user
     * @param user The user data provided by the frontend (in JSON format)
     * @return Returns the created user object along with a success message
     */
    @PostMapping("/create")
    public RestResult<User> createUser(@RequestBody User user) {
        log.info("Creating user: {}", user);
        User createdUser = userService.createUser(user);
        return RestResult.success(createdUser, "User created successfully");
    }

    /**
     * List all users
     * @return Returns the list of users along with a success message
     */
    @GetMapping("/list")
    public RestResult<List<User>> listUsers() {
        log.info("Listing all users");
        List<User> users = userService.getAllUsers();
        return RestResult.success(users, "Fetched user list successfully");
    }

    /**
     * Fetch a user by user ID
     * @param id The user ID provided as a path variable
     * @return Returns the fetched user object or an error message if the user is not found
     */
    @GetMapping("/{id}")
    public RestResult<User> getUserById(@PathVariable("id") Long id) {
        log.info("Getting user by id: {}", id);
        User user = userService.getUserById(id);
        if (user != null) {
            return RestResult.success(user, "User fetched successfully");
        } else {
            return RestResult.error("User not found", null);
        }
    }
}
