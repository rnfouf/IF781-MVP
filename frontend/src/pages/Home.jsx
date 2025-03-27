import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@/components/ui";
import JobForm from "@/components/JobForm";
import JobPreview from "@/components/JobPreview";
import EditProfile from "@/components/EditProfile"; // Import the EditProfile component
import EditWorkerProfile from "@/components/EditWorkerProfile";
import Modal from "@/components/Modal";
import Header from "@/components/Header";
import {jwtDecode} from "jwt-decode";

export default function Home() {
  const navigate = useNavigate();
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isTalentsOpen, setIsTalentsOpen] = useState(false);
  const [talents, setTalents] = useState([]);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add Job modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for Job Preview modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // State for Edit Profile modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPCD, setIsPCD] = useState(false);

  // Fetch company details and jobs
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    fetchDetails();
  }, [navigate]);

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
  
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        setIsPCD(decodedToken.pcd);
  
        if (decodedToken.pcd) {
          await fetchWorkerDetails(token);
        } else {
          await fetchCompanyDetails(token);
        }
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  };
  
  const fetchWorkerDetails = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/worker-details", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const textResponse = await response.text();
  
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }
  
      const data = JSON.parse(textResponse);
      setUser(data);
    } catch (error) {
      setError("Failed to load worker details.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCompanyDetails = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/company-details", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const textResponse = await response.text();
  
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }
  
      const data = JSON.parse(textResponse);
      setUser(data);
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
    fetchJobs(user.id);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsPreviewOpen(true);
  };

  const handleJobDeleted = () => {
    setIsPreviewOpen(false);
    fetchJobs(user.id);
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleProfileUpdated = () => {
    setIsEditProfileOpen(false);
    fetchDetails(); // Refresh the company details
  };
  
  const handleViewCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/talents/pcd/companies-applied/${user.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const textResponse = await response.text();
      const data = textResponse ? JSON.parse(textResponse) : [];
      
      // Process the response data
      const companiesArray = Array.isArray(data) ? 
        data.filter(c => c?.companyName) : 
        [];
      
      setCompanies(companiesArray);
      setIsCompaniesOpen(true);
  
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError(`Failed to load companies: ${error.message}`);
    }
  };

  const handleViewTalents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/talents/applicants/${user.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = textResponse ? JSON.parse(textResponse) : [];
      // Handle both array and single object responses
      const talentsArray = data.length === undefined ? [data] : data;
      setTalents(talentsArray.filter(t => t?.fullName)); // Add ID check
      setIsTalentsOpen(true);
    } catch (error) {
      console.error('Error fetching talents:', error);
      setError(`Failed to load talents: ${error.message}`);
    }
  };

  if (loading) return <p className="text-xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-xl">{error}</p>;
  if (!user)
    return <p className="text-red-500 text-xl">Company details not found.</p>;

  if (isPCD) {
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
                  alt="User profile picture"
                />
  
                {/* Centered content area */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-blue-600">
                    {user.fullName}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {user.role} | {user.currentCompany}
                  </p>
                </div>
              </div>
  
              {/* Extra details */}
              <div className="mt-2 p-2">
                <p className="text-lg">{user.biography}</p>
              </div>
  
              <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between">
                  <div className="w-1/2 p-6">
                    <p className="text-lg">
                      <strong>Previous experience:</strong> {user.previousExperience}
                    </p>
                    <p className="text-lg">
                      <strong>Skills:</strong> {user.skills}
                    </p>
                    <p className="text-lg">
                      <strong>Disabilities:</strong> {user.disabilities}
                    </p>
                    <p className="text-lg">
                      <strong>Needs:</strong> {user.accessibilityNeeds}
                    </p>
                  </div>
                  <div className="w-1/2 p-6">
                    <h2 className="text-2xl font-semibold">Contact info:</h2>
                    <p className="text-lg mt-4">
                      <strong>Phone:</strong> {user.phone}
                    </p>
                    <p className="text-lg">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-lg">
                      <strong>Address:</strong> {user.address}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center mt-6 space-x-6">
                  <Button
                    onClick={handleEditProfile}
                    className="px-4 py-1 text-sm"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleViewCompanies}
                    className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700"
                  >
                    View Applied Companies
                  </Button>
                </div>
              </div>
            </div>
          </div>
  
          {/* Modal for editing profile */}
          <Modal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
          >
            {user && (
              <EditWorkerProfile
                worker={user}
                onUpdate={handleProfileUpdated}
                onClose={() => setIsEditProfileOpen(false)}
              />
            )}
          </Modal>

          <Modal isOpen={isCompaniesOpen} onClose={() => setIsCompaniesOpen(false)}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Companies You've Applied To</h2>
              {companies.length === 0 ? (
                <p className="text-lg">No companies found</p>
              ) : (
                <ul className="space-y-2">
                  {companies.map((company, index) => (
                    <li
                      key={company.id || `company-${index}`}
                      className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {company.companyName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Modal>
        </div>
      </div>
    );
  } else {
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
                    {user.companyName}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {user.industry} | {user.headquarters}
                  </p>
                </div>
              </div>
  
              {/* Extra details */}
              <div className="mt-2 p-2">
                <p className="text-sm">{user.description}</p>
              </div>
  
              <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
                <p className="text-lg">
                  <strong>Specialities:</strong> {user.specialization}
                </p>
                <p className="text-lg">
                  <strong>Perks:</strong> {user.perks}
                </p>
  
                <p className="text-lg">
                  <strong>Contact info:</strong> {user.email}
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
                  onClick={handleViewTalents}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  View Your Talents
                </Button>
              </div>
            </div>
          </div>
          <Modal isOpen={isTalentsOpen} onClose={() => setIsTalentsOpen(false)}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Applicants List</h2>
              {talents.length === 0 ? (
                <p className="text-lg">No applicants found</p>
              ) : (
                <ul className="space-y-2">
                  {talents.map((talent, index) => (
                    <li
                      key={talent.pcdId || `talent-${index}`}  // Changed to pcdId
                      className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                      onClick={() => {
                        if (talent.pcdId) {  // Changed condition to check pcdId
                          navigate(`/pcd/${talent.pcdId}`);
                          setIsTalentsOpen(false);
                        }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg hover:text-blue-600">
                          {talent.fullName}
                        </span>
                        {talent.pcdId && (  // Changed to check pcdId
                          <span className="text-sm text-gray-500">
                            Click to view profile
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Modal>
  
          {/* Modal for adding a new job */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <JobForm
              companyId={user.id}
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
            {user && (
              <EditProfile
                company={user}
                onUpdate={handleProfileUpdated}
                onClose={() => setIsEditProfileOpen(false)}
              />
            )}
          </Modal>
        </div>
      </div>
    );
  }
}
