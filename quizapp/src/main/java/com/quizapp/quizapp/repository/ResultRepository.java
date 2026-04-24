package com.quizapp.quizapp.repository;

import com.quizapp.quizapp.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {

    boolean existsByUsernameAndTestName(String username, String testName);// ✅ ADD THIS

}