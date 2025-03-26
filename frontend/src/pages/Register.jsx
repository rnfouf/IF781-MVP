import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import { Button, Input } from "@/components/ui";

const Register = () => {
  const [userType, setUserType] = useState("company");
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [disabilities, setDisabilities] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("");
  const [skills, setSkills] = useState("");
  const [biography, setBiography] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
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

    const passwordValidationErrors = validatePassword();

    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    try {
      const requestBody = userType === "company" ? {
        companyName,
        email,
        password,
        role: "company"
      } : {
        fullName,
        email,
        password,
        role,
        phone,
        address,
        currentCompany,
        previousExperience,
        disabilities,
        accessibilityNeeds,
        skills,
        biography,
        roleType: "worker"
      };
      
      if (userType === "company"){
        const response = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
      } else {
        const response = await fetch("http://localhost:8080/api/auth/pcd/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
      }
      

      navigate("/login");
    } catch (err) {
      setError(err.message);
      setPasswordErrors([]);
    }
  };

  // Password validation rules
  const validatePassword = () => {
    const errors = [];
    if (password !== confirmPassword) errors.push("Passwords do not match");
    if (password.length < 8) errors.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one capital letter");
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    return errors;
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
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Job Role/Title"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                />
              </div>

              <Input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Current Company (optional)"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Previous Experience (optional)"
                  value={previousExperience}
                  onChange={(e) => setPreviousExperience(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Disabilities (optional)"
                  value={disabilities}
                  onChange={(e) => setDisabilities(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Accessibility Needs"
                  value={accessibilityNeeds}
                  onChange={(e) => setAccessibilityNeeds(e.target.value)}
                />
              </div>

              <Input
                type="text"
                placeholder="Skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />

              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Professional Biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </div>
          )}

          {/* Common fields */}
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

          <div className="mb-4">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {passwordErrors.length > 0 && (
            <div className="mb-4 text-red-500 text-sm">
              {passwordErrors.map((error, index) => (
                <p key={index}>• {error}</p>
              ))}
            </div>
          )}

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