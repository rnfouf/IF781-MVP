import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import Header from "@/components/Header";


export default function SearchResults() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");

  useEffect(() => {
    if (!searchQuery) {
      setLoading(false);
      return;
    }

    fetchCompanies();
  }, [searchQuery]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/companies?search=${searchQuery}`);
      const data = await response.json();

      if (!response.ok) {
        setError("Error fetching companies.");
        return;
      }

      setCompanies(data);
    } catch (error) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="relative">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Search Results</h1>
        
        <div className="w-full max-w-3xl text-center">
          {loading && <p className="text-xl">Loading...</p>}
          {error && <p className="text-red-500 text-xl">{error}</p>}
          {!loading && companies.length === 0 && <p className="text-xl bg-white p-4 rounded-lg shadow-md mb-4">No companies found.</p>}
        </div>
        <div className="w-full max-w-3xl">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanyClick(company.id)}
              className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold">{company.companyName}</h2>
            </div>
          ))}
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
