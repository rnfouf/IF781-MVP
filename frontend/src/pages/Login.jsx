import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input} from "@/components/ui";
import { isAuthenticated } from "@/utils/auth";

export default function Login() {
  const [userType, setUserType] = useState("company");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if already authenticated
    }
  }, [navigate]);

  const toggleUserType = () => {
    setUserType(prev => prev === "company" ? "worker" : "company");
  };

  const handleLogin = async () => {
    setError("");

    try {
      if (userType === 'company') {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password}),
        });

        const data = await response.json();

        if (!response.ok) {
          setError("Incorrect credentials");
          return;
        }

        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        const response = await fetch("http://localhost:8080/api/auth/pcd/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password}),
        });

        const data = await response.json();

        if (!response.ok) {
          setError("Incorrect credentials");
          return;
        }

        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      setError("Server error, try again later");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-2">Sign in</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your details below to continue.
        </p>

        {/* Role Toggle */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm ${userType === 'company' ? 'text-blue-600' : 'text-gray-400'}`}>
              Company
            </span>
            <div
              onClick={toggleUserType}
              className="relative w-12 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors duration-200"
              role="switch"
              aria-checked={userType === "worker"}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 
                  ${userType === 'company' ? 'left-1' : 'left-7'}`}
              />
            </div>
            <span className={`text-sm ${userType === 'worker' ? 'text-blue-600' : 'text-gray-400'}`}>
              Worker
            </span>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <Button onClick={handleLogin}>Continue</Button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        {/* Sign Up Link */}
        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}