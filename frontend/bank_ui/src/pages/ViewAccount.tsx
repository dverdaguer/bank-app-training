import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPayload } from "../utils/jwt";
import { useNavigate } from "react-router-dom";
import "./ViewAccount.css";
import API_URL from "../utils/constants";

interface Account {
  account_id: number;
  account_type: string;
  accountId?: number; // For compatibility with backend response
  accountType?: string; // For compatibility with backend response
}

const ViewAccount: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const payload = getPayload();
    if (!payload || !payload.user_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    axios
      .get(`${API_URL}/api/users/${payload.user_id}/accounts`)
      .then((res) => {
        setAccounts(res.data);
        setLoading(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_err) => {
        setError("Failed to fetch accounts.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h2>Your Accounts</h2>
      {accounts.length === 0 ? (
        <div>No accounts found.</div>
      ) : (
        <div className="cards">
          {accounts.map((account) => (
            <div key={account.account_id} className="card">
              <div>
                <div>
                  <strong>Account ID:</strong>{" "}
                  {account.account_id || account.accountId}
                </div>
                <div>
                  <strong>Type:</strong>{" "}
                  {account.account_type || account.accountType}
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/account/${account.account_id || account.accountId}`,
                  )
                }
                className="detailsButton"
              >
                Account Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAccount;
