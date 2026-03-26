import React from "react";
import { useNavigate } from "react-router-dom";
import { getPayload } from "../utils/jwt";
import "../App.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const payload = getPayload();
  return (
    <div className="home-root">
      <h1>Welcome to Bank App</h1>
      {payload && (
        <div className="home-user-info">
          <strong>User:</strong> {payload.name} <br />
          <strong>Role:</strong> {payload.role}
        </div>
      )}
      <div className="home-actions">
        <button onClick={() => navigate("/create-account")}>
          Create Account
        </button>
        <button onClick={() => navigate("/view-account")}>View Accounts</button>
      </div>
    </div>
  );
};

export default Home;
