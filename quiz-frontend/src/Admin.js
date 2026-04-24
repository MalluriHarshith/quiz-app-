import { useState, useEffect } from "react";

function Admin() {

    // ================= FORM STATE =================
    const [form, setForm] = useState({
        testName: "",   // ✅ ADDED
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",
    });

    const [errors, setErrors] = useState({});
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);   // 🔥 NEW
    const [editId, setEditId] = useState(null);

    // ================= FETCH QUESTIONS =================
    const loadQuestions = () => {
        fetch("http://localhost:8080/questions")
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
            })
            .catch(err => {
                console.error("Error loading questions:", err);
            });
    };

    // ================= FETCH RESULTS =================
    const loadResults = () => {
        fetch("http://localhost:8080/results")
            .then(res => res.json())
            .then(data => {
                console.log("RESULT DATA:", data);
                setResults(Array.isArray(data) ? data : []);
            });
    };

    // ================= INITIAL LOAD =================
    useEffect(() => {
        loadQuestions();
        loadResults();
    }, []);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        // remove error when typing
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    // ================= VALIDATION =================
    const validate = () => {

        let newErrors = {};

        Object.keys(form).forEach((key) => {

            if (!form[key] || form[key].trim() === "") {
                newErrors[key] = "Required";
            }

        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ================= DELETE =================
    const handleDelete = (id) => {

        const confirmDelete = window.confirm("Delete this question?");
        if (!confirmDelete) return;

        fetch(`http://localhost:8080/questions/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                loadQuestions();
            })
            .catch(err => {
                console.error("Delete error:", err);
            });
    };
    const handleDeleteResult = async (id) => {
        const confirmDelete = window.confirm("Delete this result?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:8080/results/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const text = await res.text();
                alert("❌ " + text);
                return;
            }

            // refresh properly
            loadResults();

        } catch (err) {
            console.error("Delete result error:", err);
            alert("❌ Failed to delete result");
        }
    };

    // ================= EDIT =================
    const handleEdit = (q) => {

        setForm({
            testName: q.testName || "",   // ✅ FIXED
            question: q.question || "",
            option1: q.option1 || "",
            option2: q.option2 || "",
            option3: q.option3 || "",
            option4: q.option4 || "",
            correctAnswer: q.correctAnswer || "",
        });

        setEditId(q.id);
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {

        // ❌ VALIDATION FAIL
        if (!validate()) {
            alert("❌ Fill all fields");
            return;
        }

        const { option1, option2, option3, option4, correctAnswer } = form;

        // ❌ WRONG ANSWER CHECK
        if (
            correctAnswer !== option1 &&
            correctAnswer !== option2 &&
            correctAnswer !== option3 &&
            correctAnswer !== option4
        ) {
            alert("❌ Correct answer must match one of the options");
            return;
        }

        try {

            const url = editId
                ? `http://localhost:8080/questions/${editId}`
                : "http://localhost:8080/questions";

            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const text = await response.text();

            // ❌ BACKEND ERROR
            if (!response.ok) {
                alert("❌ " + text);
                return;
            }

            // ✅ SUCCESS
            if (editId) {
                alert("✅ Question Updated");
            } else {
                alert("✅ Question Added");
            }

            // ================= RESET FORM =================
            setForm({
                testName: "",   // ✅ IMPORTANT
                question: "",
                option1: "",
                option2: "",
                option3: "",
                option4: "",
                correctAnswer: ""
            });

            setEditId(null);

            // reload data
            loadQuestions();

        } catch (error) {

            console.error("Submit error:", error);
            alert("❌ Server error");

        }
    };

    // ================= FORM VALID =================
    const isFormValid = Object.values(form).every(
        val => val && val.trim() !== ""
    );

    // ================= UI =================
    return (
        <div style={outerContainer}>

            <div style={card}>

                {/* TITLE */}
                <h2 style={title}>
                    {editId ? "Edit Question" : "Add Question"}
                </h2>

                {/* ================= INPUT FIELDS ================= */}
                {Object.keys(form).map((key) => (

                    <div key={key} style={{ width: "100%" }}>

                        <input
                            name={key}
                            placeholder={formatLabel(key)}
                            value={form[key]}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                border: errors[key]
                                    ? "2px solid red"
                                    : "1px solid #ccc"
                            }}
                        />

                        {errors[key] && (
                            <p style={errorText}>{errors[key]}</p>
                        )}

                    </div>

                ))}

                {/* ================= BUTTON ================= */}
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    style={{
                        ...buttonStyle,
                        opacity: isFormValid ? 1 : 0.5,
                        cursor: isFormValid ? "pointer" : "not-allowed"
                    }}
                >
                    {editId ? "Update Question" : "Add Question"}
                </button>

                {/* ================= QUESTIONS ================= */}
                <h3 style={subtitle}>All Questions</h3>

                {questions.map((q) => (

                    <div key={q.id} style={questionCard}>

                        <p style={questionText}>
                            {q.question}
                        </p>

                        <p style={{ fontSize: "12px", color: "gray" }}>
                            Test: {q.testName}
                        </p>

                        <div style={buttonGroup}>

                            <button
                                onClick={() => handleEdit(q)}
                                style={editBtn}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(q.id)}
                                style={deleteBtn}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

                {/* ================= RESULTS ================= */}
                <h3 style={subtitle}>Student Results</h3>

                {results.length === 0 && (
                    <p style={{ color: "gray" }}>
                        No results yet
                    </p>
                )}

                {[...new Map(results.map(r => [r.username, r])).values()]
                    .sort((a, b) => a.username.localeCompare(b.username))
                    .map((r) => (
                        <div key={r.id} style={resultCard}>
                            <p><b>{r.username}</b></p>
                            <p>Score: {r.score} / {r.total}</p>
                            <p>Percentage: {((r.score / r.total) * 100).toFixed(1)}%</p>

                            <button
                                onClick={() => handleDeleteResult(r.id)}
                                style={{
                                    marginTop: "10px",
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}

            </div>
        </div>
    );
}

// ================= STYLES =================

const outerContainer = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
};

const card = {
    width: "100%",
    maxWidth: "550px",
    margin: "0 auto",
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
};

const title = {
    textAlign: "center",
    marginBottom: "10px"
};

const subtitle = {
    marginTop: "20px",
    textAlign: "center"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "6px 0",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold"
};

const questionCard = {
    width: "100%",
    marginTop: "12px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
};

const resultCard = {
    width: "100%",
    marginTop: "8px",
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    fontSize: "14px"
};

const questionText = {
    fontWeight: "bold"
};

const buttonGroup = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px"
};

const editBtn = {
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px"
};

const deleteBtn = {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px"
};

const errorText = {
    color: "red",
    fontSize: "12px",
    margin: "0 0 5px 0"
};

const formatLabel = (key) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase());
};

export default Admin;