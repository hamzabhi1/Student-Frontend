import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPages.css";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../store/slices/authSlice";
import useSubmit from "../hooks/useSubmit";

const Login = () => {
  const { token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { submit } = useSubmit();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await submit("/login", { email, password });
      if (res.ok && res.data) {
        if (res.data.token) dispatch(setToken({ token: res.data.token }));
        if (res.data.user) dispatch(setUser({ userdata: res.data.user }));
        toast.success("Login successful");
        navigate("/home");
      } else {
        toast.error(res.error || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <section className="auth-page student-portal-bg">
      <article className="auth-card">
        {/* Optional: Add a university/school logo image here */}
        <p className="auth-kicker">Academic Portal</p>
        <h1 className="auth-title">Student Management System</h1>
        <p className="auth-subtitle">Access your courses, grades, and campus resources.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Student Email / ID</label>
            <input
              id="login-email"
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your student password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>
      </article>
    </section>
  );
};

export default Login;