import { useState } from "react";
import api from "../api";
import { User, Lock, ShoppingCart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // ===================== STATE =====================
  const [form, setForm] = useState({
    UserName: "", // Updated to match backend schema
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===================== HANDLE LOGIN =====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        UserName: form.UserName,
        Password: form.Password
      });

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.msg || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-black/20">
        
        {/* TITLE */}
        <div className="text-center mb-6">
          <ShoppingCart className="text-white mx-auto mb-2" size={48} />
          <h2 className="text-white text-2xl font-bold">
            SRMS Login
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Sales Records Management System
          </p>
          <p className="text-white/40 text-xs mt-2">
            DAB Enterprise LTD
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-white/10 text-white/70 p-3 rounded-lg mb-4 text-sm text-center border border-black/20">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* USERNAME */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 focus-within:bg-white/20 transition">
            <User className="text-white/70" size={18} />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 bg-transparent text-white outline-none placeholder-white/40"
              value={form.UserName}
              onChange={(e) =>
                setForm({ ...form, UserName: e.target.value })
              }
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 focus-within:bg-white/20 transition">
            <Lock className="text-white/70" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-transparent text-white outline-none placeholder-white/40"
              value={form.Password}
              onChange={(e) =>
                setForm({ ...form, Password: e.target.value })
              }
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-3 rounded-lg transition font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-center text-white/60 mt-4 text-sm">
          Don't have an account?{" "}
          <Link className="text-white hover:text-white/80 hover:underline transition" to="/register">
            Register here
          </Link>
        </p>

        {/* DEMO CREDENTIALS */}
      
      </div>
    </div>
  );
}