import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@/components/ui";

export default function Home() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]); // State for jobs
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
        fetchJobs(data.id); // Fetch jobs after getting company details
      } catch (error) {
        setError("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async (companyId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/jobs/${companyId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const textResponse = await response.text();

        if (!response.ok) {
          setError(`Error: ${response.status} ${response.statusText}`);
          return;
        }

        const data = JSON.parse(textResponse);
        setJobs(data); // Set the jobs data
      } catch (error) {
        setError("Failed to load jobs.");
      }
    };

    fetchCompanyDetails();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddJob = () => {
    // Button functionality will be implemented later
    console.log("Add new job button clicked");
  };

  const handleViewStatistics = () => {
    // Button functionality will be implemented later
    console.log("View statistics button clicked");
  };

  const handleJobClick = (jobId) => {
    // Navigate to the job detail page (implementation will come later)
    console.log("Navigating to job detail page for job ID:", jobId);
  };

  if (loading) return <p className="text-xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-xl">{error}</p>;
  if (!company) return <p className="text-red-500 text-xl">Company details not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl flex space-x-8">
        {/* Company Profile */}
        <div className="flex-1">
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

        {/* Job Listings */}
        <div className="flex-1 max-h-80 overflow-y-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Job Listings</h2>
            <div className="mt-4 max-h-80 overflow-y-auto">
              <ul className="space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-lg text-center">No jobs available.</p>
                ) : (
                  jobs.map((job) => (
                    <li key={job.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <Button
                        onClick={() => handleJobClick(job.id)} // Handle job click
                        className="w-full text-left text-lg font-semibold bg-white border-2 border-gray-300 hover:bg-gray-50 pl-4 pr-4"
                      >
                        {job.title}
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Buttons for adding job and viewing statistics */}
          <div className="mt-8 text-center flex justify-center space-x-6">
            <Button onClick={handleAddJob} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Add New Job
            </Button>
            <Button onClick={handleViewStatistics} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              View Statistics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
