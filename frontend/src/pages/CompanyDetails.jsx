import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@/components/ui";
import JobPreviewUser from "@/components/JobPreviewUser";
import Modal from "@/components/Modal";
import Header from "@/components/Header";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

export default function CompanyDetails() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for Job Preview modal
  const [selectedJob, setSelectedJob] = useState(null);
  const {companyId} = useParams()
  const [isPCD, setIsPCD] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // 'success' or 'error'
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Fetch company details on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchCompanyDetails(companyId);
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIsPCD(decoded.pcd);
    }
  }, []);

  const fetchCompanyDetails = async (companyId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/companies/company-details/${companyId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const textResponse = await response.text();
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = JSON.parse(textResponse);
      setCompany(data);
      fetchJobs(data.id);
    } catch (error) {
      console.error(error);
      setError("Failed to load company details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/jobs/${companyId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/talents/pcd/apply/${companyId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Application failed");
      }
  
      setApplicationStatus("success");
      setApplicationMessage(data.message || "Application submitted successfully!");
    } catch (error) {
      setApplicationStatus("error");
      setApplicationMessage(error.message);
    } finally {
      setIsApplying(false);
    }
  };
  
  const handleRemoveApplication = async () => {
    setIsApplying(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/talents/pcd/remove-application/${companyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Removal failed");
      }
  
      setApplicationStatus("success");
      setApplicationMessage(data.message || "Application removed successfully!");
    } catch (error) {
      setApplicationStatus("error");
      setApplicationMessage(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <p className="text-xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-xl">{error}</p>;
  if (!company)
    return <p className="text-red-500 text-xl">Company details not found.</p>;

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
                <h1 className="text-4xl font-bold text-blue-600">
                  {company.companyName}
                </h1>
                <p className="text-lg text-gray-600">Company Profile</p>
              </div>
            </div>

            {/* Extra details */}
            <div className="mt-2 p-2">
              <p className="text-sm">{company.description}</p>
            </div>
            <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
              <p className="text-lg">
                <strong>Specialities:</strong> {company.specialization}
              </p>
              <p className="text-lg">
                <strong>Perks:</strong> {company.perks}
              </p>

              <p className="text-lg">
                <strong>Contact info:</strong> {company.email}
              </p>
            </div>
            {isPCD && (
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
                disabled={isApplying}
              >
                {isApplying ? (
                  <div className="flex items-center">
                    <span className="mr-2">Applying...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Apply to Company"
                )}
              </Button>
              <Button
                onClick={handleRemoveApplication}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
                disabled={isApplying}
              >
                {isApplying ? (
                  <div className="flex items-center">
                    <span className="mr-2">Removing...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Remove Application"
                )}
              </Button>
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
                      <li
                        key={job.id}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <Button
                          onClick={() => handleJobClick(job)}
                          className="w-full text-left text-lg font-semibold bg-white border-2 border-gray-300 hover:bg-gray-50 pl-4 pr-4"
                        >
                          {job.title} - {job.salary}
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
              pcd={company.pcd}
            />
          )}
        </Modal>

        <Modal isOpen={!!applicationStatus} onClose={() => setApplicationStatus(null)}>
          <div className="p-6 text-center">
            <h2 className={`text-2xl font-bold mb-4 ${
              applicationStatus === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {applicationStatus === "success" ? "✓ Success!" : "⚠ Error"}
            </h2>
            <p className="text-lg mb-6">{applicationMessage}</p>
            <Button
              onClick={() => setApplicationStatus(null)}
              className={`px-6 py-2 ${
                applicationStatus === "success" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              Continue
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
