import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFormById } from "../form.service";

const FormViewerPage = () => {
  const { formId } = useParams<{ formId: string }>();

  const {
    data: form,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => getFormById(formId!),
    enabled: !!formId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading form...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center h-screen">
        Form not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {form.name}
        </h1>
        <form>
          <div className="space-y-6">
            {form.questions.map((question) => (
              <div key={question.airtableFieldId}>
                <label className="block text-sm font-medium text-gray-700">
                  {question.label}
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  // TODO: render different input types based on question.type
                />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormViewerPage;
