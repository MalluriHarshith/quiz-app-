package com.quizapp.quizapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.quizapp.quizapp.model.User;
import com.quizapp.quizapp.service.UserService;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/login")
    public User login(@RequestBody User user) {

        User loggedUser = service.login(user.getUsername(), user.getPassword());

        if (loggedUser == null) {
            throw new RuntimeException("Invalid credentials");
        }

        return loggedUser;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.getEmail() == null || !user.getEmail().endsWith("@gmail.com")) {
            throw new RuntimeException("Email must be valid (@gmail.com)");
        }
        return service.saveUser(user);

    }
}