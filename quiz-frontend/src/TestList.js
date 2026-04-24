import { useEffect, useState } from "react";

function TestList({ setPage, setSelectedTest }) {

    const [tests, setTests] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/questions")
            .then(res => res.json())
            .then(data => {
                // ✅ extract unique test names
                const uniqueTests = [
                    ...new Set(
                        data
                            .map(q => q.testName)
                            .filter(test => test && test.trim() !== "")
                    )
                ];

                setTests(uniqueTests); // 👈 ADD THIS LINE RIGHT HERE
            })
            .catch(() => alert("❌ Failed to load tests"));
    }, []);

    return (
        <div style={container}>

            <div style={card}>

                <h2 style={title}>Select a Test</h2>

                {tests.length === 0 && (
                    <p style={{ color: "gray" }}>No tests available</p>
                )}

                {tests.map((test, index) => (
                    <div
                        key={index}
                        style={testCard}
                        onClick={() => {
                            setSelectedTest(test);
                            setPage("quiz");
                        }}
                    >
                        {test}
                    </div>
                ))}

            </div>
        </div>
    );

}

export default TestList;
const container = {
    minHeight: "100vh",
    width: "100%",
    background: "#e2e8f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const card = {
    width: "400px",   // 🔥 fixed width (IMPORTANT)
    background: "white",
    padding: "30px 25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center"
};

const title = {
    marginBottom: "20px"
};

const testCard = {
    width: "100%",
    height: "45px",
    marginTop: "20px",
    background: "#3b82f6",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};