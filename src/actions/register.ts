"use server";
import { login } from "./login";

export async function register(
  username: string,
  email: string,
  password: string
) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  // Replace with your actual backend API endpoint for registration
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/register`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    // Handle error responses from the backend
    return {
      status: response.status,
      error: data.detail || "Registration failed.",
    };
  }
  await login(username , password)
  return {
    message: data.message || "User registered successfully",
    status: 200,
  };
}
