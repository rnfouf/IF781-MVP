import { Button } from "@/components/ui";

export default function JobPreview({ job, onClose }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-600">{job.title}</h2>
      <p className="text-lg text-gray-700"><strong>Description:</strong> {job.description}</p>
      <p className="text-lg text-gray-700"><strong>Location:</strong> {job.location}</p>
      <p className="text-lg text-gray-700"><strong>Salary:</strong> {job.salary}</p>
      <div className="flex justify-end space-x-4">
        <Button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </Button>
        <Button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-red-700"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}