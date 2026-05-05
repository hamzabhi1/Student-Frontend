import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { useSelector } from "react-redux";


const App = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={token ? "/home" : "/login"} replace />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
