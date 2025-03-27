import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import Header from "@/components/Header";

export default function PCD() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pcd, setPCD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchWorkerDetails();
  }, [navigate, id]);

  const fetchWorkerDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/talents/pcd/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const textResponse = await response.text();
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = JSON.parse(textResponse);
      setPCD(data);
    } catch (error) {
      setError("Failed to load worker details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-xl">{error}</p>;
  if (!pcd) return <p className="text-red-500 text-xl">Worker details not found.</p>;

  return (
    <div className="relative">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl">
          <div className="flex items-center mb-8">
            <img
              src="https://www.svgrepo.com/show/13656/user.svg"
              className="h-20 w-20 mr-4"
              alt="Worker profile"
            />
            <div>
              <h1 className="text-4xl font-bold text-blue-600">{pcd.fullName}</h1>
              <p className="text-lg text-gray-600">{pcd.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Professional Information</h2>
                <p><strong>Skills:</strong> {pcd.skills}</p>
                <p><strong>Experience:</strong> {pcd.previousExperience}</p>
                <p><strong>Biography:</strong> {pcd.biography}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
                <p><strong>Email:</strong> {pcd.email}</p>
                <p><strong>Phone:</strong> {pcd.phone}</p>
                <p><strong>Address:</strong> {pcd.address}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Accessibility Needs</h2>
                <p><strong>Disabilities:</strong> {pcd.disabilities}</p>
                <p><strong>Requirements:</strong> {pcd.accessibilityNeeds}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}