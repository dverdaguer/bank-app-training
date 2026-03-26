import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CreateAccount from "./pages/CreateAccount";
import ViewAccount from "./pages/ViewAccount";
import AccountDetails from "./pages/AccountDetails";
import Transactions from "./pages/Transactions";
import { getToken } from "./utils/jwt";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    if (getToken()) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handler to be passed to Login page
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated && <NavBar onLogout={() => setIsAuthenticated(false)} />}
      <div style={{ paddingTop: 56 }}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegisterSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/create-account"
            element={
              isAuthenticated ? (
                <CreateAccount />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/view-account"
            element={
              isAuthenticated ? (
                <ViewAccount />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/account/:accountId"
            element={
              isAuthenticated ? (
                <AccountDetails />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/transactions/:accountId"
            element={
              isAuthenticated ? (
                <Transactions />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
