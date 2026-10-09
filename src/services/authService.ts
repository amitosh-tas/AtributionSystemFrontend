import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials) {
  const response = await axios.post(
    `${API_BASE_URL}/auth/user/login`,
    credentials
  );

  return response.data;
}