import { type FormQuestionData, type FormAnswerValue } from "../form.service";

interface QuestionRendererProps {
  question: FormQuestionData;
  value: FormAnswerValue;
  onChange: (fieldId: string, value: FormAnswerValue) => void;
}

const QuestionRenderer = ({
  question,
  value,
  onChange,
}: QuestionRendererProps) => {
  const commonInputClass =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  switch (question.type) {
    case "multilineText":
    case "richText":
      return (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(question.airtableFieldId, e.target.value)}
          className={commonInputClass}
          rows={4}
        />
      );

    case "singleSelect":
      return (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(question.airtableFieldId, e.target.value)}
          className={commonInputClass}
        >
          <option value="">Select an option</option>
          {question.options?.choices.map((choice) => (
            <option key={choice.id} value={choice.name}>
              {choice.name}
            </option>
          ))}
        </select>
      );

    case "multipleSelects":
      return (
        <select
          multiple
          value={(value as string[]) || []}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            onChange(question.airtableFieldId, selectedOptions);
          }}
          className={commonInputClass}
        >
          {question.options?.choices.map((choice) => (
            <option key={choice.id} value={choice.name}>
              {choice.name}
            </option>
          ))}
        </select>
      );

    case "attachment":
      return (
        <input
          type="file"
          onChange={(e) =>
            onChange(
              question.airtableFieldId,
              e.target.files ? e.target.files[0] : null
            )
          }
          className={`${commonInputClass} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100`}
        />
      );

    case "singleLineText":
    default:
      return (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(question.airtableFieldId, e.target.value)}
          className={commonInputClass}
        />
      );
  }
};

export default QuestionRenderer;
