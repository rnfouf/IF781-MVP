export default function Input({ type = "text", placeholder, value, onChange }) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="p-2 border rounded w-full"
      />
    );
  }
  