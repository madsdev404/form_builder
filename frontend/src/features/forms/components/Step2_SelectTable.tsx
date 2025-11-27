import { FiGrid, FiAlertCircle } from "react-icons/fi";
import { type AirtableTable } from "@/entities/airtable/airtable.service";

interface Step2_SelectTableProps {
  tables: AirtableTable[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectedTable: AirtableTable | null;
  onTableSelect: (table: AirtableTable) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2_SelectTable = ({
  tables,
  isLoading,
  isError,
  error,
  selectedTable,
  onTableSelect,
  onNext,
  onBack,
}: Step2_SelectTableProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-gray-500 mt-8">Loading tables...</div>
      );
    }

    if (isError) {
      return (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md mt-8">
          <p className="font-semibold">Error fetching data</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      );
    }

    if (tables && tables.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => onTableSelect(table)}
              className={`p-4 border rounded-lg text-left transition-colors cursor-pointer ${
                selectedTable?.id === table.id
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <FiGrid className="w-6 h-6 mb-2 text-gray-500" />
              <p className="font-semibold text-gray-800">{table.name}</p>
            </button>
          ))}
        </div>
      );
    }

    // Handle empty state
    return (
      <div className="mt-8 text-center border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <FiAlertCircle className="mx-auto w-12 h-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No tables found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This base has no tables. Please create a table in Airtable to
          continue.
        </p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Step 2: Select a Table
      </h2>
      <p className="mt-1 text-gray-600">
        Now, choose the table within your selected base.
      </p>

      {renderContent()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTable}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2_SelectTable;
