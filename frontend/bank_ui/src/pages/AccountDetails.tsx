/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Account {
  account_id: number;
  userName: string;
  balance: number;
  accountId?: number; // For compatibility with backend response
}

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    axios
      .get(`http://127.0.0.1:5000/api/accounts/${accountId}`)
      .then((res) => {
        setAccount(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch account details.");
        setLoading(false);
      });
  }, [accountId]);

  const handleDeposit = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/accounts/${accountId}/deposit`,
        { amount: parseFloat(amount) },
      );
      setActionSuccess("Deposit successful!");
      setShowDeposit(false);
      setAmount("");
      // Refresh account details
      const res = await axios.get(
        `http://127.0.0.1:5000/api/accounts/${accountId}`,
      );
      setAccount(res.data);
    } catch (err: any) {
      setActionError(err.response?.data?.error || "Deposit failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/accounts/${accountId}/withdraw`,
        { amount: parseFloat(amount) },
      );
      setActionSuccess("Withdrawal successful!");
      setShowWithdraw(false);
      setAmount("");
      // Refresh account details
      const res = await axios.get(
        `http://127.0.0.1:5000/api/accounts/${accountId}`,
      );
      setAccount(res.data);
    } catch (err: any) {
      setActionError(err.response?.data?.error || "Withdrawal failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Loading account details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!account) return <div>Account not found.</div>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Account Details</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Account ID:</strong> {account.account_id || account.accountId}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>User Name:</strong> {account.userName}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Current Balance:</strong> ${Number(account.balance).toFixed(2)}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => {
            setShowDeposit((v) => !v);
            setShowWithdraw(false);
            setActionError("");
            setActionSuccess("");
          }}
        >
          Make Deposit
        </button>
        <button
          onClick={() => {
            setShowWithdraw((v) => !v);
            setShowDeposit(false);
            setActionError("");
            setActionSuccess("");
          }}
        >
          Make Withdrawal
        </button>
        <button
          onClick={() =>
            navigate(`/transactions/${account.account_id || account.accountId}`)
          }
        >
          View Transactions
        </button>
      </div>
      {(showDeposit || showWithdraw) && (
        <div style={{ marginBottom: 16 }}>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{ marginRight: 8 }}
            disabled={actionLoading}
          />
          <button
            onClick={showDeposit ? handleDeposit : handleWithdraw}
            disabled={actionLoading || !amount || parseFloat(amount) <= 0}
          >
            Confirm
          </button>
          <button
            onClick={() => {
              setShowDeposit(false);
              setShowWithdraw(false);
              setAmount("");
              setActionError("");
              setActionSuccess("");
            }}
            disabled={actionLoading}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        </div>
      )}
      {actionError && (
        <div style={{ color: "red", marginBottom: 8 }}>{actionError}</div>
      )}
      {actionSuccess && (
        <div style={{ color: "green", marginBottom: 8 }}>{actionSuccess}</div>
      )}
    </div>
  );
};

export default AccountDetails;
