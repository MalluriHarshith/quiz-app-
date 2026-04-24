package com.quizapp.quizapp.controller;

import com.quizapp.quizapp.model.Result;
import com.quizapp.quizapp.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/results")
public class ResultController {

    @Autowired
    private ResultRepository repo;
    @Autowired
    private ResultRepository resultRepository;

    @PostMapping
    public ResponseEntity<?> saveResult(@RequestBody Result r) {

        if (repo.existsByUsernameAndTestName(r.getUsername(), r.getTestName())) {
            return ResponseEntity
                    .badRequest()
                    .body("You already submitted this test");
        }

        return ResponseEntity.ok(repo.save(r));
    }

    @GetMapping
    public List<Result> getAllResults() {
        return repo.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResult(@PathVariable Long id) {
        resultRepository.deleteById(id);
        return ResponseEntity.ok("Result deleted successfully");
    }
}