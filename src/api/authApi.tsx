import axios from "axios";

const API_URL =  "https://localhost:7166/api/Auth"

export const loginUser = async (email: string, password: string) => {
     console.log(email,password)
  const response = await axios.post(`${API_URL}/login`, { Username :email, password });
 
  return response.data; // contains { token, message }
};
