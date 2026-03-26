import React, { useState } from "react";
import axios from "axios";
import { getPayload } from "../utils/jwt";

const CreateAccount: React.FC = () => {
  const [accountType, setAccountType] = useState("Checking");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const payload = getPayload();
    if (!payload || !payload.user_id) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/accounts",
        {
          userId: payload.user_id,
          accountType,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      if (response.status === 201) {
        setMessage("Account created successfully!");
      } else {
        setError("Failed to create account.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
