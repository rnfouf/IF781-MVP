import { useState } from "react";
import { Button } from "@/components/ui";

export default function EditProfile({ company, onUpdate, onClose }) {
  const [companyName, setCompanyName] = useState(company.companyName);
  const [email, setEmail] = useState(company.email);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!companyName || !email) {
      setError("All fields are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const payload = { companyName, email };
      console.log("Sending update request:", payload); // Log the payload
  
      const response = await fetch("http://localhost:8080/api/auth/update-profile", {
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
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