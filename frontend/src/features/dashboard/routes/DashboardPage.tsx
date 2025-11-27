import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getForms } from "@/features/forms/form.service";
import { FiFileText } from "react-icons/fi";

const DashboardPage = () => {
  const {
    data: forms,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Forms</h1>
        <Link
          to="/create-form"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Form
        </Link>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500">Loading forms...</div>
      )}

      {isError && (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
          <p className="font-semibold">Error fetching forms</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      )}

      {forms && (
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {forms.length > 0 ? (
              forms.map((form) => (
                <li key={form._id}>
                  <Link
                    to={`/form/${form._id}`}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <FiFileText className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{form.name}</p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 hover:text-gray-800">
                      View →
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                You haven't created any forms yet.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
