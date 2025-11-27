import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBases } from "@/entities/airtable/airtable.service";
import { FiDatabase, FiAlertCircle } from "react-icons/fi";

const CreateFormPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);

  const {
    data: bases,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["airtableBases"],
    queryFn: getBases,
    enabled: currentStep === 1,
  });

  const handleNext = () => {
    if (selectedBaseId) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const renderStep1 = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Step 1: Select a Base
      </h2>
      <p className="mt-1 text-gray-600">
        Choose the Airtable base you want to create a form for.
      </p>

      {isLoading && (
        <div className="text-center text-gray-500 mt-8">Loading bases...</div>
      )}
      {isError && (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md mt-8">
          <p className="font-semibold">Error fetching data</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      )}
      {bases && bases.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {bases.map((base) => (
            <button
              key={base.id}
              onClick={() => setSelectedBaseId(base.id)}
              className={`p-4 border rounded-lg text-left transition-colors cursor-pointer ${
                selectedBaseId === base.id
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <FiDatabase className="w-6 h-6 mb-2 text-gray-500" />
              <p className="font-semibold text-gray-800">{base.name}</p>
            </button>
          ))}
        </div>
      )}
      {bases && bases.length === 0 && (
        <div className="mt-8 text-center border-2 border-dashed border-gray-300 p-8 rounded-lg">
          <FiAlertCircle className="mx-auto w-12 h-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Airtable bases found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please create a base in your Airtable account first to continue.
          </p>
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedBaseId}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Step 2: Select a Table
      </h2>
      <p className="mt-1 text-gray-600">
        Now, choose the table within your selected base.
      </p>
      <div className="mt-8 text-center border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <p className="text-gray-500">Table selection UI will be here.</p>
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          disabled
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
    </div>
  );
};

export default CreateFormPage;
