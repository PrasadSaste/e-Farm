import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/login.css";

const Login = () => {
  const [form, setForm] = useState({ role: "farmer", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      alert(`Logged in as ${res.data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <div className="role-group">
        {["farmer", "customer", "broker", "admin"].map((r) => (
          <label key={r}>
            <input
              type="radio"
              name="role"
              value={r}
              checked={form.role === r}
              onChange={handleChange}
            />{" "}
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </label>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="register-link">
        Not registered? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
