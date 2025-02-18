import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SearchResults from "@/pages/SearchResults"; // Import SearchResults
import ProtectedRoute from "./ProtectedRoute";

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
      </Routes>
    </Router>
  );
}
