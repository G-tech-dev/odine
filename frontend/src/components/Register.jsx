import { useState } from "react";
import api from "../api";
import { User, Lock, ShoppingCart, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // ===================== STATE =====================
  const [form, setForm] = useState({
    UserName: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===================== HANDLE REGISTER =====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (form.UserName.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      setLoading(false);
      return;
    }

    if (form.Password.length < 4) {
      setError("Password must be at least 4 characters long");
      setLoading(false);
      return;
    }

    if (form.Password !== form.ConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        UserName: form.UserName.trim(),
        Password: form.Password
      });

      setSuccess("Account created successfully! Redirecting to login...");
      
      // Clear form
      setForm({
        UserName: "",
        Password: "",
        ConfirmPassword: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle specific error messages
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(err.response.data.errors).join(", ");
        setError(errorMessages);
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===================== HANDLE INPUT CHANGE =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* MAIN CARD */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          
          {/* TITLE SECTION */}
          <div className="text-center mb-8">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="text-white" size={32} />
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">
              Create Account
            </h2>
            <p className="text-white/60 text-sm">
              Join Sales Records Management System
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-200 p-3 rounded-lg mb-4 text-sm text-center">
              {success}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* USERNAME FIELD */}
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Username *
              </label>
              <div className="flex items-center bg-white/10 rounded-lg px-3 focus-within:bg-white/20 transition-all duration-200 border border-transparent focus-within:border-white/30">
                <User className="text-white/50" size={18} />
                <input
                  type="text"
                  name="UserName"
                  placeholder="Enter username (min. 3 characters)"
                  className="w-full p-3 bg-transparent text-white outline-none placeholder-white/30"
                  value={form.UserName}
                  onChange={handleChange}
                  required
                  minLength="3"
                  autoComplete="username"
                />
              </div>
              <p className="text-white/40 text-xs mt-1">
                Username must be unique and at least 3 characters
              </p>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Password *
              </label>
              <div className="flex items-center bg-white/10 rounded-lg px-3 focus-within:bg-white/20 transition-all duration-200 border border-transparent focus-within:border-white/30">
                <Lock className="text-white/50" size={18} />
                <input
                  type="password"
                  name="Password"
                  placeholder="Enter password (min. 4 characters)"
                  className="w-full p-3 bg-transparent text-white outline-none placeholder-white/30"
                  value={form.Password}
                  onChange={handleChange}
                  required
                  minLength="4"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-white/40 text-xs mt-1">
                Password must be at least 4 characters long
              </p>
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Confirm Password *
              </label>
              <div className="flex items-center bg-white/10 rounded-lg px-3 focus-within:bg-white/20 transition-all duration-200 border border-transparent focus-within:border-white/30">
                <Lock className="text-white/50" size={18} />
                <input
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Confirm your password"
                  className="w-full p-3 bg-transparent text-white outline-none placeholder-white/30"
                  value={form.ConfirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black p-3 rounded-lg font-semibold transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-white/60 text-sm">
              Already have an account?{" "}
              <Link 
                className="text-white hover:text-white/80 hover:underline transition-all duration-200 font-medium" 
                to="/"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-white/30 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}