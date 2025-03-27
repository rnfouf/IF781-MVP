import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PCD from "@/pages/PCD";
import SearchResults from "@/pages/SearchResults"; // Import SearchResults
import ProtectedRoute from "./ProtectedRoute";
import CompanyDetails from "@/pages/CompanyDetails";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/:companyId"
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pcd/:id"
          element={
            <ProtectedRoute>
              <PCD />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
