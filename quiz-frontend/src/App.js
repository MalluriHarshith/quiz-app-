import { useState } from "react";
import Login from "./login";
import Signup from "./Signup";
import Admin from "./Admin";
import Quiz from "./Quiz";
import TestList from "./TestList";
function App() {

  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");
  const [selectedTest, setSelectedTest] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setPage("login");
  };

  let content;

  // ✅ decide what to show
  // ✅ decide what to show
  if (role === "admin") {
    content = <Admin />;
  }
  else if (page === "signup") {
    content = <Signup setPage={setPage} />;
  }
  else if (role === "student" && page === "tests") {
    content = (
      <TestList
        setPage={setPage}
        setSelectedTest={setSelectedTest}
      />
    );
  }
  else if (role === "student" && page === "quiz") {
    content = <Quiz selectedTest={selectedTest} setPage={setPage} />;
  }
  else {
    content = (
      <Login
        setRole={setRole}
        setPage={setPage}
      />
    );
  }
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAVBAR */}
      {role && (
        <div style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0 }}>Quiz App</h3>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 14px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* ✅ CENTER AREA */}
      <div style={{ flex: 1 }}>
        {content}
      </div>

    </div>
  );
}
export default App;
