const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-[#f4c752] hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
