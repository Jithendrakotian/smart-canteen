import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  function getErrorMessage(code) {
    switch (code) {
      case "auth/email-already-in-use": return "Email already registered. Try logging in.";
      case "auth/invalid-email": return "Invalid email address.";
      case "auth/weak-password": return "Password is too weak.";
      default: return "Signup failed. Please try again.";
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Medium", "Strong"];
  const strengthColors = ["", "#dc3545", "#ffc107", "#28a745"];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🍽️</div>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join SmartCanteen today</p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group-custom">
              <label className="form-label-custom">Full Name</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Riya Sharma"
                  required
                  className="form-input-custom"
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                  className="form-input-custom"
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="form-input-custom"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  <i className={`fas fa-eye${showPass ? "-slash" : ""}`}></i>
                </button>
              </div>
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="strength-segment"
                        style={{
                          backgroundColor: i <= strength ? strengthColors[strength] : "#e0e0e0",
                        }}
                      ></div>
                    ))}
                  </div>
                  <span style={{ color: strengthColors[strength], fontSize: "0.78rem" }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Confirm Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="form-input-custom"
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? (
                <span><span className="btn-spinner"></span> Creating account...</span>
              ) : (
                <span>Create Account <i className="fas fa-user-plus"></i></span>
              )}
            </button>
          </form>

          <div className="auth-alt-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
