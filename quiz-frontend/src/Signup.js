import { useState } from "react";


// ✅ styles at top
const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold"
};

// ✅ COMPONENT FUNCTION STARTS HERE
function Signup({ setPage }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleSignup = () => {
        if (!email.includes("@gmail.com")) {
            alert("❌ Email must be a valid Gmail address");
            return;
        }
        fetch("http://localhost:8080/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed");
                }
                return res.json();
            })
            .then(data => {
                alert("Signup successful ✅");
                setPage("login");   // 🔥 THIS REDIRECTS
            })
            .catch(err => {
                console.error(err);
                alert("Signup failed ❌");
            });
    };
    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                width: "350px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>

                <h2>Create Account</h2>

                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={inputStyle}
                />

                <input
                    type="email"   // ✅ ADD THIS LINE
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={inputStyle}
                />

                <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={inputStyle}
                />

                <button onClick={() => setShowPass(!showPass)}>
                    👁
                </button>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Teacher</option>
                    <option value="STUDENT">Student</option>
                </select>
                <button
                    onClick={handleSignup}
                    style={buttonStyle}
                >
                    Sign Up
                </button>

                <p onClick={() => setPage("login")} style={{ cursor: "pointer", marginTop: "10px" }}>
                    Back to Login
                </p>

            </div>
        </div>
    );
}

// ✅ EXPORT
export default Signup;