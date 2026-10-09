import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials) {
  const res = await axios.post(
    `${API_BASE_URL}/auth/user/login`,
    credentials
  );

  return res.data;
}

export async function getMe(){
  const res = await axios.get(
    `${API_BASE_URL}/auth/me`,
    {
      withCredentials: true,
    }
  )

  return res;
}