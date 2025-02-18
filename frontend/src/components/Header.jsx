import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/components/ui";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (search.trim()) {
        navigate(`/search-results?query=${encodeURIComponent(search)}`);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="ml-4 text-xl font-bold text-gray-800">PCDFinder</div>

      <div className="flex items-center space-x-2 mr-4 w-1/3"> 
        <Input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full text-lg px-4 py-3 border border-gray-300 rounded-lg"
        />
        <Button onClick={handleSearch} className="px-4 py-2 text-sm">Search</Button>
      </div>
    </header>
  );
}