import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input} from "@/components/ui";
import { isAuthenticated } from "@/utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if already authenticated
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Incorrect credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/");
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
