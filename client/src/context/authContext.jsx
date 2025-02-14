import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create the context for authentication
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  axios.defaults.withCredentials = true;  

  // Login function
  const login = async (inputs) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, inputs);
      setCurrentUser(res.data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Code to sync user data to local storage whenever the current user changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

