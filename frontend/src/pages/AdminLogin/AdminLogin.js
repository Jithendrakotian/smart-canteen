import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../Login/Auth.css";
import "./AdminLogin.css";

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      const docSnap = await getDoc(doc(db, "users", result.user.uid));
      if (!docSnap.exists() || docSnap.data().role !== "admin") {
        await result.user.auth.signOut();
        setError("Access denied. This account is not an admin.");
        setLoading(false);
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page admin-login-bg">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="admin-badge">👑 Admin Portal</div>
            <div className="auth-logo">🍽️</div>
            <h2 className="auth-title">Admin Login</h2>
            <p className="auth-subtitle">Authorized personnel only</p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="fas fa-shield-alt"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group-custom">
              <label className="form-label-custom">Admin Email</label>
              <div className="input-wrapper">
                <i className="fas fa-user-shield input-icon"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@canteen.com"
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
                  placeholder="Admin password"
                  required
                  className="form-input-custom"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  <i className={`fas fa-eye${showPass ? "-slash" : ""}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-auth admin-btn" disabled={loading}>
              {loading ? (
                <span><span className="btn-spinner"></span> Authenticating...</span>
              ) : (
                <span>Login as Admin <i className="fas fa-arrow-right"></i></span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
