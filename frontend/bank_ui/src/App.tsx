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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handler to be passed to Login page
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
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
      </Routes>
    </Router>
  );
};

export default App;
