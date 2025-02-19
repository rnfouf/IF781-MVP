import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@/components/ui";
import JobPreviewUser from "@/components/JobPreviewUser";
import Modal from "@/components/Modal";
import Header from "@/components/Header";

export default function CompanyDetails() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for Job Preview modal
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch company details on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchCompanyDetails();
  }, [navigate]);

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
      fetchJobs(data.id);
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
      setJobs(data);
    } catch (error) {
      setError("Failed to load jobs.");
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsPreviewOpen(true);
  };

  if (loading) return <p className="text-xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-xl">{error}</p>;
  if (!company) return <p className="text-red-500 text-xl">Company details not found.</p>;

  return (
    <div className="relative">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl flex space-x-8">
          {/* Company Profile */}
          <div className="flex-1">
            <div className="flex items-center">
              {/* Company Logo */}
              <img 
                src="https://www.svgrepo.com/show/13656/user.svg"
                className="h-20 w-20 mr-4"
                alt="Company logo"
              />
              {/* Company Details */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-blue-600">{company.companyName}</h1>
                <p className="text-lg text-gray-600">Company Profile</p>
              </div>
            </div>

            {company.isOwner && (
              <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
                <p className="text-lg"><strong>Email:</strong> {company.email}</p>
                <p className="text-lg"><strong>Company ID:</strong> {company.id}</p>
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
                          onClick={() => handleJobClick(job)}
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
          </div>
        </div>

        {/* Modal for job preview */}
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
          {selectedJob && (
            <JobPreviewUser
              job={selectedJob}
              onClose={() => setIsPreviewOpen(false)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
