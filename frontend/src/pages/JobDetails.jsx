import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Job Detail</h2>
      {/* Add your job detail content here */}
    </div>
  );
}