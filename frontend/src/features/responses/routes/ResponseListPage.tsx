import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResponses } from "../response.service";
import { getFormById } from "@/features/forms/form.service";

const ResponseListPage = () => {
  const { formId } = useParams<{ formId: string }>();

  const {
    data: form,
    isLoading: isFormLoading,
    isError: isFormError,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => getFormById(formId!),
    enabled: !!formId,
  });

  const {
    data: responses,
    isLoading: areResponsesLoading,
    isError: areResponsesError,
  } = useQuery({
    queryKey: ["responses", formId],
    queryFn: () => getResponses(formId!),
    enabled: !!formId,
  });

  if (isFormLoading || areResponsesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading responses...
      </div>
    );
  }

  if (isFormError || areResponsesError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading data.
      </div>
    );
  }

  if (!form || !responses) {
    return (
      <div className="flex justify-center items-center h-screen">
        No data found.
      </div>
    );
  }

  const questionIds = form.questions.map((q) => q.airtableFieldId);
  const questionLabels = form.questions.reduce((acc, q) => {
    acc[q.airtableFieldId] = q.label;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Responses for: {form.name}</h1>

      {responses.length === 0 ? (
        <p>This form doesn't have any responses yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Submission Date
                </th>
                {questionIds.map((id) => (
                  <th
                    key={id}
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {questionLabels[id]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {responses.map((response) => (
                <tr key={response._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(response.createdAt).toLocaleString()}
                  </td>
                  {questionIds.map((id) => (
                    <td
                      key={id}
                      className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap"
                    >
                      {response.answers[id]
                        ? JSON.stringify(response.answers[id])
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResponseListPage;
