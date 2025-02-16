const Card = ({ jobTitle, companyName, description, logo }) => {
  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition">
      {/* Company Logo */}
      <div className="w-16 h-16 flex-shrink-0 mr-4">
        <img
          src={logo}
          alt={`${companyName} logo`}
          className="w-full h-full object-cover rounded-lg border border-gray-300"
        />
      </div>

      {/* Job Info */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{jobTitle}</h3>
        <p className="text-gray-600 text-sm">{companyName}</p>
        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default Card;
