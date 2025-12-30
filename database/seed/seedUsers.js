import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../backend/models/User.js"; // import User model
import { hashPassword } from "../../backend/utils/hash.js";

dotenv.config();

const users = [
  { name: "Farmer1", email: "farmer1@example.com", password: "123456", role: "farmer" },
  { name: "Customer1", email: "customer1@example.com", password: "123456", role: "customer" },
];

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (let u of users) {
    u.password = await hashPassword(u.password);
    await User.create(u);
  }
  console.log("Users seeded");
  process.exit();
};

seedUsers();
