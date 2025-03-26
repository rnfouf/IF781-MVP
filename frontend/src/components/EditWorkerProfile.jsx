import { useState } from "react";
import { Button } from "@/components/ui";

export default function EditWorkerProfile({ worker, onUpdate, onClose }) {
  const [fullName, setFullName] = useState(worker.fullName);
  const [phone, setPhone] = useState(worker.phone);
  const [email, setEmail] = useState(worker.email);
  const [address, setAddress] = useState(worker.address);
  const [role, setRole] = useState(worker.role);
  const [currentCompany, setCurrentCompany] = useState(worker.currentCompany);
  const [biography, setBiography] = useState(worker.biography);
  const [previousExperience, setPreviousExperience] = useState(worker.previousExperience);
  const [skills, setSkills] = useState(worker.skills);
  const [disabilities, setDisabilities] = useState(worker.disabilities);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(worker.accessibilityNeeds);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fullName || !phone || !email || !address || !role || !currentCompany || !biography || !previousExperience || !skills || !disabilities || !accessibilityNeeds) {
      setError("All fields are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const payload = {fullName, phone, email, address, role, currentCompany, biography, previousExperience, skills, disabilities, accessibilityNeeds};
      console.log("Sending update request:", payload); // Log the payload
  
      const response = await fetch("http://localhost:8080/api/auth/pcd/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      const data = await response.json();
      onUpdate(); // Refresh the profile
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message); // Display the error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Current Company</label>
            <input
            type="text"
            value={currentCompany}
            onChange={(e) => setCurrentCompany(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Biography</label>
            <input
            type="text"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Previous Experience</label>
            <input
            type="text"
            value={previousExperience}
            onChange={(e) => setPreviousExperience(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Disabilities</label>
            <input
            type="text"
            value={disabilities}
            onChange={(e) => setDisabilities(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Accessibility Needs</label>
            <input
            type="text"
            value={accessibilityNeeds}
            onChange={(e) => setAccessibilityNeeds(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </Button>
        <Button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Save Changes
        </Button>
      </div>
    </form>
  );
}