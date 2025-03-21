import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState, useContext } from "react";
import axios from "axios";
import { URL } from "../url";
import { ToastContext } from "../context/ToastContext";
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);

  const validateForm = () => {
    if (!username.trim()) {
      toast.warning("Username is required");
      return false;
    }
    
    if (username.length < 3) {
      toast.warning("Username must be at least 3 characters long");
      return false;
    }
    
    if (!email.trim()) {
      toast.warning("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Please enter a valid email address");
      return false;
    }
    
    if (!password.trim()) {
      toast.warning("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(false);
    try {
      const res = await axios.post(URL + "/api/auth/register", {
        username,
        email,
        password,
      });
      setLoading(false);
      showToast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      showToast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
        <h1 className="text-lg md:text-xl font-extrabold">
          <Link to="/" className="hover:text-pink-300 transition duration-300">Blog Market</Link>
        </h1>
        <h3>
          <Link to="/login" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition duration-300">Login</Link>
        </h3>
      </div>
      
      <div className="w-full flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-indigo-100 to-purple-100">
        <div className="flex flex-col justify-center items-center space-y-4 w-[90%] md:w-[60%] lg:w-[30%] bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold text-center text-gray-800">Create an Account</h1>
          <p className="text-gray-600 text-center mb-4">Join our community of writers and readers</p>
          
          <div className="w-full">
            <label className="text-sm text-gray-600 mb-1 block">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="text"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="w-full">
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="w-full">
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-4 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
          
          <div className="flex justify-center items-center space-x-3 w-full border-t border-gray-200 pt-4">
            <p className="text-gray-600">Already have an account?</p>
            <p className="text-purple-600 hover:text-pink-600 font-medium transition">
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Register;