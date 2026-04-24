
package com.quizapp.quizapp.service;

import com.quizapp.quizapp.model.Question;
import com.quizapp.quizapp.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    QuestionRepository repo;

    // Get all questions
    public List<Question> getAllQuestions() {
        return repo.findAll();
    }

    // Add new question
    public Question addQuestion(Question q) {
        return repo.save(q);
    }

    public Question updateQuestion(Long id, Question q) {
        q.setId(id);
        return repo.save(q);
    }

    public void deleteQuestion(Long id) {
        repo.deleteById(id);
    }
}
