import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Transactions.css";

interface Transaction {
  txn_id: number;
  txn_type: string;
  amount: number;
  created_at: string;
}

const Transactions: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accountId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    axios
      .get(`http://127.0.0.1:5000/api/accounts/${accountId}/transactions`)
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch transactions.");
        setLoading(false);
      });
  }, [accountId]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h2>Transaction History</h2>
      <button
        style={{ marginBottom: 20 }}
        onClick={() => navigate(`/account/${accountId}`)}
      >
        Back to Account Details
      </button>
      {transactions.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">ID</th>
              <th className="th">Type</th>
              <th className="th">Amount</th>
              <th className="th">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.txn_id}>
                <td className="td">{txn.txn_id}</td>
                <td className="td">{txn.txn_type}</td>
                <td className="td">${Number(txn.amount).toFixed(2)}</td>
                <td className="td">
                  {new Date(txn.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
