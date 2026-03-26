import React from "react";
import { useNavigate } from "react-router-dom";
import { getPayload, removeToken } from "../utils/jwt";
import "./NavBar.module.css";

const NavBar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const payload = getPayload();
  const userName = payload?.name || "User";

  const handleLogout = () => {
    removeToken();
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="left">
        <span className="logo">Bank App</span>
      </div>
      <div className="center">
        <button className="navButton" onClick={() => navigate("/")}>
          Home
        </button>
        <button
          className="navButton"
          onClick={() => navigate("/create-account")}
        >
          Create Account
        </button>
        <button className="navButton" onClick={() => navigate("/view-account")}>
          View Accounts
        </button>
      </div>
      <div className="right">
        <span className="userName">Welcome, {userName}</span>
        <button
          className="navButton"
          style={{ marginLeft: 16 }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
