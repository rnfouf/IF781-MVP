export const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Check if a token exists
  };
  
  export const logout = () => {
    localStorage.removeItem("token"); // Remove token
  };
  