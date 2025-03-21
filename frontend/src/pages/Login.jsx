import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useContext, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(URL + "/api/auth/login", { email, password });
      setLoading(false);
      login(res.data);
      showToast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
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
          <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition duration-300">Register</Link>
        </h3>
      </div>
      
      <div className="w-full flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-indigo-100 to-purple-100">
        <div className="flex flex-col justify-center items-center space-y-4 w-[90%] md:w-[30%] bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold text-left text-gray-800">Welcome Back</h1>
          
          <div className="w-full">
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="text"
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
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-4 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          
          {error && <div className="text-red-500 text-sm bg-red-100 w-full p-3 rounded-lg">Invalid email or password. Please try again.</div>}
          
          <div className="flex justify-center items-center space-x-3 w-full border-t border-gray-200 pt-4">
            <p className="text-gray-600">New here?</p>
            <p className="text-purple-600 hover:text-pink-600 font-medium transition">
              <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Login;
