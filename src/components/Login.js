import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null); // To hold any error messages
  const [success, setSuccess] = useState(null); // To hold success messages
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      
      const response = await axios.post(
        "https://h43sje6zi4.execute-api.us-east-1.amazonaws.com/prod/login",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      
        setSuccess("Login successful!"); 
        console.log(response.data); 
        navigate('/upload');
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message); // Set error message
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md"
    >
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
      {success && <p className="text-green-500 mb-4">{success}</p>} {/* Display success message */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="block w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="block w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Login
      </button>
      <div className="mt-4">
        <p>Don't have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </form>
  );
};

export default Login;
