import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import { Button, Input } from "@/components/ui";

const Register = () => {
  const [userType, setUserType] = useState("company");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const toggleUserType = () => {
    setUserType(prev => prev === "company" ? "worker" : "company");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const requestBody = userType === "company" ? {
        companyName,
        email,
        password,
        role: "company"
      } : {
        firstName,
        lastName,
        email,
        password,
        role: "worker"
      };

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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

        <form onSubmit={handleRegister}>
          {userType === "company" ? (
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit">Continue</Button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

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