import { useEffect, useState } from "react";

function Quiz({ selectedTest, setPage }) {

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false); // ✅ prevent resubmit
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/questions")
            .then(res => res.json())
            .then(data => {
                // ✅ FILTER BY TEST NAME
                const filtered = data.filter(q => q.testName === selectedTest);
                setQuestions(filtered);
            })
            .catch(() => alert("❌ Failed to load questions"));
    }, [selectedTest]);

    const handleChange = (qid, value) => {
        setAnswers({ ...answers, [qid]: value });
    };

    const handleSubmit = async () => {

        // ❌ prevent resubmission (frontend)
        if (submitted) {
            alert("❌ You already submitted the quiz");
            return;
        }

        let score = 0;

        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                score++;
            }
        });

        try {
            // 🔥 SAVE RESULT TO BACKEND
            const res = await fetch("http://localhost:8080/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username") || "student",
                    score: score,
                    total: questions.length,
                    testName: selectedTest   // 🔥 THIS FIXES 500 ERROR
                })
            });

            const text = await res.text(); // ✅ read backend response

            if (!res.ok) {
                alert("❌ " + text);  // ❌ show backend error
                return;
            }
            setSubmitted(true);
            alert("✅ Quiz submitted successfully");

            // 👇 THIS IS STEP 2
            setPage("tests");

        } catch (err) {
            console.error(err);
            alert("❌ Server error");
        }
    };

    return (
        <div style={container}>

            <div style={card}>

                {questions.map((q, index) => (
                    <div key={q.id} style={questionBlock}>

                        <h3>Q{index + 1}. {q.question}</h3>

                        {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                            <label key={i} style={option}>
                                <input
                                    type="radio"
                                    name={q.id}
                                    value={opt}
                                    onChange={() => handleChange(q.id, opt)}
                                    disabled={submitted} // ✅ lock after submit
                                />
                                {opt}
                            </label>
                        ))}

                    </div>
                ))}

                <button
                    style={{
                        ...submitBtn,
                        background: submitted ? "gray" : "#3b82f6"
                    }}
                    onClick={handleSubmit}
                    disabled={submitted} // ✅ disable button
                >
                    {submitted ? "Submitted" : "Submit"}
                </button>

            </div>
        </div>
    );
}

// ================= STYLES =================

// ================= STYLES =================

const container = {
    minHeight: "100vh",
    background: "#e2e8f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
};

const card = {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
};

const questionBlock = {
    marginBottom: "20px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px"
};

const option = {
    display: "block",
    margin: "8px 0",
    cursor: "pointer"
};

const submitBtn = {
    width: "100%",
    height: "45px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
};
export default Quiz;