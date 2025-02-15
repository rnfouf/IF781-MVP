import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, CardContent } from "@/components/ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For incorrect credentials
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Incorrect credentials");
        return;
      }

      localStorage.setItem("token", data.token); // Store JWT
      navigate("/"); // Redirect to Home page on success
    } catch (error) {
      setError("Server error, try again later");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={handleLogin}>Login</Button>
            <Button variant="outline">Create an Account</Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
