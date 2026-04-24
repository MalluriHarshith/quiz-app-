package com.quizapp.quizapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quizapp.quizapp.model.User;
import com.quizapp.quizapp.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public User login(String input, String password) {

        User user = repo.findByUsernameAndPassword(input, password);

        if (user == null) {
            user = repo.findByEmailAndPassword(input, password);
        }

        return user;
    }

    public User saveUser(User user) {
        return repo.save(user);
    }
}