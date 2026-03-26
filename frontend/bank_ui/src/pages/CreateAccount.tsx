/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { getPayload } from "../utils/jwt";
import API_URL from "../utils/constants";

const CreateAccount: React.FC = () => {
  const [accountType, setAccountType] = useState("Checking");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const payload = getPayload();
  const isAdmin = payload?.role === "Admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    if (!payload || !payload.user_id) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    try {
      const reqBody: any = {
        userId: payload.user_id,
        accountType,
      };
      if (isAdmin && email) {
        reqBody.email = email;
      }
      const response = await axios.post(`${API_URL}/api/accounts`, reqBody, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        setMessage("Account created successfully!");
      } else {
        setError("Failed to create account.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="accountType">Account Type</label>
        <select
          id="accountType"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 16 }}
        >
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>
        {isAdmin && (
          <>
            <label htmlFor="email">User Email (optional)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email for account (optional)"
              style={{ display: "block", width: "100%", marginBottom: 16 }}
            />
          </>
        )}
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        {message && (
          <div style={{ color: "green", marginTop: 16 }}>{message}</div>
        )}
        {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      </form>
    </div>
  );
};

export default CreateAccount;
