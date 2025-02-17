import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@/components/ui";

export default function Home() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/company-details", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const textResponse = await response.text();

        if (!response.ok) {
          setError(`Error: ${response.status} ${response.statusText}`);
          return;
        }

        const data = JSON.parse(textResponse);
        setCompany(data);
      } catch (error) {
        setError("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="text-xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-xl">{error}</p>;
  if (!company) return <p className="text-red-500 text-xl">Company details not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-blue-600 text-center">{company.companyName}</h1>
        <p className="text-lg text-gray-600 text-center">Company Profile</p>

        {company.isOwner && (
          <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
            <p className="text-lg"><strong>Email:</strong> {company.email}</p>
            <p className="text-lg"><strong>Company ID:</strong> {company.id}</p>

            <div className="flex justify-center items-center mt-6 space-x-6">
              <Button className="px-4 py-1 text-sm">Edit Profile</Button>
              <span
                className="text-red-600 cursor-pointer text-sm font-medium hover:underline"
                onClick={handleLogout}
              >
                Logout
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
