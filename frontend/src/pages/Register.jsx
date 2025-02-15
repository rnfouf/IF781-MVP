import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

const Register = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if already authenticated
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-2">Sign up</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Create an account to get started.
        </p>

        <form onSubmit={handleRegister}>
          {/* Company Name Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Company Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#f4c752] hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
          >
            Continue
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        {/* Already have an account? */}
        <p className="text-gray-600 text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
