import React from "react";
import { useNavigate } from "react-router-dom";
import { getPayload, removeToken } from "../utils/jwt";
import styles from "./NavBar.module.css";

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
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.logo}>Bank App</span>
      </div>
      <div className={styles.center}>
        <button className={styles.navButton} onClick={() => navigate("/")}>
          Home
        </button>
        <button
          className={styles.navButton}
          onClick={() => navigate("/create-account")}
        >
          Create Account
        </button>
        <button
          className={styles.navButton}
          onClick={() => navigate("/view-account")}
        >
          View Accounts
        </button>
      </div>
      <div className={styles.right}>
        <span className={styles.userName}>Welcome, {userName}</span>
        <button
          className={styles.navButton}
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
