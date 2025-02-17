export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
    const isExpired = decoded.exp * 1000 < Date.now(); // Check if the token is expired
    return !isExpired; // Return true if the token is valid and not expired
  } catch (error) {
    return false; // Return false if the token is invalid
  }
};

export const logout = () => {
  localStorage.removeItem("token"); // Remove token
};