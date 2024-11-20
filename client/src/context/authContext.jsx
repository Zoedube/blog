import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create the context for authentication
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login function
  const login = async (inputs) => {
    try {
      // Make a POST request to login endpoint using the full API URL
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, inputs);
      setCurrentUser(res.data);
    } catch (error) {
      console.error("Login failed", error);
      // Optionally set an error state for user feedback
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Make a POST request to logout endpoint using the full API URL
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally set an error state for user feedback
    }
  };

  // Sync user data to localStorage whenever the current user changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
