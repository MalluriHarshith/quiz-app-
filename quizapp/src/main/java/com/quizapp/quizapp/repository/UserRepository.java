package com.quizapp.quizapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quizapp.quizapp.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUsernameAndPassword(String username, String password);

    User findByEmailAndPassword(String email, String password);
}
