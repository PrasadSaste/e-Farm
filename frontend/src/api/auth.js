import axios from "axios";

// Create an Axios instance (optional)
const api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
});

// Named export for registerUser
export const registerUser = (formData) => {
  return api.post("/auth/register", formData);
};
