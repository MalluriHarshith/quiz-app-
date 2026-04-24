
package com.quizapp.quizapp.controller;

import com.quizapp.quizapp.model.Question;
import com.quizapp.quizapp.repository.QuestionRepository;
import com.quizapp.quizapp.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@CrossOrigin

public class QuestionController {

    @Autowired
    QuestionService service;
    @Autowired
    private QuestionRepository repo;

    // GET all questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return service.getAllQuestions();
    }

    // POST new question
    @PostMapping
    public ResponseEntity<?> addQuestion(@RequestBody Question q) {

        if (q.getQuestion() == null || q.getQuestion().trim().isEmpty() ||
                q.getOption1() == null || q.getOption1().trim().isEmpty() ||
                q.getOption2() == null || q.getOption2().trim().isEmpty() ||
                q.getOption3() == null || q.getOption3().trim().isEmpty() ||
                q.getOption4() == null || q.getOption4().trim().isEmpty() ||
                q.getCorrectAnswer() == null || q.getCorrectAnswer().trim().isEmpty()) {

            return ResponseEntity.badRequest().body("All fields are required");
        }

        String correct = q.getCorrectAnswer().trim();

        if (!correct.equals(q.getOption1().trim()) &&
                !correct.equals(q.getOption2().trim()) &&
                !correct.equals(q.getOption3().trim()) &&
                !correct.equals(q.getOption4().trim())) {

            return ResponseEntity.badRequest().body("Correct answer must match one of the options");
        }

        return ResponseEntity.ok(repo.save(q));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Question q) {

        if (q.getQuestion() == null || q.getQuestion().trim().isEmpty() ||
                q.getOption1() == null || q.getOption1().trim().isEmpty() ||
                q.getOption2() == null || q.getOption2().trim().isEmpty() ||
                q.getOption3() == null || q.getOption3().trim().isEmpty() ||
                q.getOption4() == null || q.getOption4().trim().isEmpty() ||
                q.getCorrectAnswer() == null || q.getCorrectAnswer().trim().isEmpty()) {

            return ResponseEntity.status(400).body("All fields are required");
        }

        String correct = q.getCorrectAnswer().trim().toLowerCase();

        if (!(correct.equals(q.getOption1().trim().toLowerCase()) ||
                correct.equals(q.getOption2().trim().toLowerCase()) ||
                correct.equals(q.getOption3().trim().toLowerCase()) ||
                correct.equals(q.getOption4().trim().toLowerCase()))) {

            return ResponseEntity.status(400)
                    .body("Correct answer must match one of the options");
        }

        q.setId(id);
        return ResponseEntity.ok(repo.save(q));
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        service.deleteQuestion(id);
    }
}
