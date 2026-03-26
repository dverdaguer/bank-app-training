import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import API_URL from "../utils/constants";

type RegisterProps = {
  onRegisterSuccess: () => void;
};

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/users`,
        { name, email, password, role },
        { headers: { "Content-Type": "application/json" } },
      );
      if (response.status === 201) {
        // Automatically log in after registration
        const loginResp = await axios.post(
          `${API_URL}/login`,
          { email, password },
          { headers: { "Content-Type": "application/json" } },
        );
        if (loginResp.status === 200) {
          onRegisterSuccess();
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
