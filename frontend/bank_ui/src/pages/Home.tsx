import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPayload } from "../utils/jwt";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const payload = getPayload();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <h1>Welcome to Bank App</h1>
      {payload && (
        <div style={{ marginBottom: 24 }}>
          <strong>User:</strong> {payload.name} <br />
          <strong>Role:</strong> {payload.role}
        </div>
      )}
      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <button onClick={() => navigate('/create-account')}>Create Account</button>
        <button onClick={() => navigate('/view-account')}>View Account</button>
      </div>
    </div>
  );
};

export default Home;
