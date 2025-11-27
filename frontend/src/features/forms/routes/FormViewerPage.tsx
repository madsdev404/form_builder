import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getFormById,
  submitResponse,
  type FormAnswerValue,
} from "../form.service";
import { FiLoader } from "react-icons/fi";

const FormViewerPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const [answers, setAnswers] = useState<Record<string, FormAnswerValue>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const mutation = useMutation({
    mutationFn: (newAnswers: Record<string, FormAnswerValue>) =>
      submitResponse(formId!, newAnswers),
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      alert(`Error submitting form: ${error.message}`);
    },
  });

  const handleInputChange = (fieldId: string, value: FormAnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(answers);
  };

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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Thank You!</h1>
          <p className="text-gray-600">
            Your response has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {form.name}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {form.questions.map((question) => (
              <div key={question.airtableFieldId}>
                <label className="block text-sm font-medium text-gray-700">
                  {question.label}
                </label>
                <input
                  type="text"
                  value={(answers[question.airtableFieldId] as string) || ""}
                  onChange={(e) =>
                    handleInputChange(question.airtableFieldId, e.target.value)
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  // TODO: render different input types based on question.type
                />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormViewerPage;
