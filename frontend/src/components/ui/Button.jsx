export default function Button({ children, onClick, variant = "default" }) {
    return (
      <button
        onClick={onClick}
        className={`p-2 rounded ${
          variant === "outline" ? "border border-gray-500" : "bg-blue-500 text-white"
        }`}
      >
        {children}
      </button>
    );
  }
  