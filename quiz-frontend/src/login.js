import { useState } from "react";

function Login({ setRole, setPage }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {
            const res = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const text = await res.text();

            if (!res.ok) {
                throw new Error(text);
            }

            const data = JSON.parse(text);

            // ✅ store user info
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            alert("Login successful ✅");

            // ✅ backend decides role (SECURE)
            if (data.role === "ADMIN") {
                setRole("admin");
            } else {
                setRole("student");
                setPage("tests");   // ✅ IMPORTANT

            }

        } catch (err) {
            console.error(err);
            alert("❌ " + err.message);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to right, #e0eafc, #cfdef3)",
            padding: "20px",
            boxSizing: "border-box"
        }}>

            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                width: "350px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
            }}>

                <h2>Quiz App Login</h2>

                {/* ✅ ALWAYS SHOW LOGIN FORM */}
                <p style={{ color: "gray" }}>Login</p>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: "85%",
                        padding: "10px",
                        margin: "10px auto",
                        display: "block"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "85%",
                        padding: "10px",
                        margin: "10px auto",
                        display: "block"
                    }}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: "85%",
                        padding: "10px",
                        margin: "15px auto",
                        display: "block",
                        background: "#4f46e5",
                        color: "white",
                        border: "none",
                        borderRadius: "6px"
                    }}
                >
                    Login
                </button>

                <button
                    onClick={() => setPage("signup")}
                    style={{
                        marginTop: "10px",
                        background: "transparent",
                        border: "none",
                        color: "#4f46e5",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Create Account
                </button>

            </div>
        </div>
    );
}

export default Login;