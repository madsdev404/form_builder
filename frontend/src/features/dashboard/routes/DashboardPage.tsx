import { getBases } from "@/entities/airtable/airtable.service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const {
    data: bases,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["airtableBases"],
    queryFn: getBases,
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Your Airtable Bases
        </h1>
        <Link
          to="/create-form"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Form
        </Link>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500">Loading bases...</div>
      )}

      {isError && (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
          <p className="font-semibold">Error fetching data</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      )}

      {bases && (
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {bases.length > 0 ? (
              bases.map((base) => (
                <li key={base.id} className="p-4 hover:bg-gray-50">
                  <p className="font-medium text-gray-900">{base.name}</p>
                  <p className="text-sm text-gray-500">
                    Permission: {base.permissionLevel}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No bases found in your Airtable account.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
