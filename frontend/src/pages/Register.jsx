import { useState } from "react";
import { registerUser } from "../api/auth"; // ← import here
import "../styles/register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await registerUser(form);
    alert("Registration successful!");
    console.log(res.data);
  } catch (err) {
    // Fallback if message is undefined
    const msg = err.response?.data?.message || "Registration failed";
    alert(msg);
    console.error("Registration failed:", msg);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" required />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      {/* Add role radio buttons if needed */}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
