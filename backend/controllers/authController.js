import User from "../models/User.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create new user
    const user = await User.create({ name, email, password: hashed, role });

    // Generate token
    const token = generateToken(user);

    // Send response
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err); // log error
    res.status(500).json({ message: err.message || "Server error" });
  }
};
