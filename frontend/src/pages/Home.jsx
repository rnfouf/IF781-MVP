import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@/components/ui";
import JobForm from "@/components/JobForm";
import JobPreview from "@/components/JobPreview";
import EditProfile from "@/components/EditProfile"; // Import the EditProfile component
import Modal from "@/components/Modal";
import Header from "@/components/Header";

export default function Home() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add Job modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for Job Preview modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // State for Edit Profile modal
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch company details and jobs
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

      const response = await fetch(
        "http://localhost:8080/api/auth/company-details",
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddJob = () => {
    setIsModalOpen(true);
  };

  const handleJobAdded = () => {
    setIsModalOpen(false);
    fetchJobs(company.id);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsPreviewOpen(true);
  };

  const handleJobDeleted = () => {
    setIsPreviewOpen(false);
    fetchJobs(company.id);
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleProfileUpdated = () => {
    setIsEditProfileOpen(false);
    fetchCompanyDetails(); // Refresh the company details
  };

  const handleViewStatistics = () => {
    console.log("View statistics button clicked");
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
              {/* Image on the left */}
              <img
                src="https://www.svgrepo.com/show/13656/user.svg"
                className="h-20 w-20 mr-4"
                alt="Company logo"
              />

              {/* Centered content area */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-blue-600">
                  {company.companyName}
                </h1>
                <p className="text-lg text-gray-600">
                  {company.industry} | {company.headquarters}
                </p>
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
              <div className="flex justify-center items-center mt-6 space-x-6">
                <Button
                  onClick={handleEditProfile}
                  className="px-4 py-1 text-sm"
                >
                  Edit Profile
                </Button>
                {/* <span
                    className="text-red-600 cursor-pointer text-sm font-medium hover:underline"
                    onClick={handleLogout}
                  >
                    Logout
                  </span> */}
              </div>
            </div>
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

            {/* Buttons for adding job and viewing statistics */}
            <div className="mt-8 text-center flex justify-center space-x-6">
              <Button
                onClick={handleAddJob}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add New Job
              </Button>
              <Button
                onClick={handleViewStatistics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                View Statistics
              </Button>
            </div>
          </div>
        </div>

        {/* Modal for adding a new job */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <JobForm
            companyId={company.id}
            onJobAdded={handleJobAdded}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>

        {/* Modal for job preview */}
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
          {selectedJob && (
            <JobPreview
              job={selectedJob}
              onDelete={handleJobDeleted}
              onClose={() => setIsPreviewOpen(false)}
            />
          )}
        </Modal>

        {/* Modal for editing profile */}
        <Modal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        >
          {company && (
            <EditProfile
              company={company}
              onUpdate={handleProfileUpdated}
              onClose={() => setIsEditProfileOpen(false)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
