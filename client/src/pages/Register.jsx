import React, { useState, useContext } from "react"; // Import useContext here
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext"; 

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); // Access currentUser from context

  console.log(currentUser); // Debugging to check the currentUser

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        inputs
      );
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      // Set error message from the response
      setError(err.response ? err.response.data : "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}> {/* Using onSubmit to handle form submission */}
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit">Register</button> {/* Use type="submit" for form submission */}
        {err && <p>{err}</p>} {/* Display error message if there's an error */}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
