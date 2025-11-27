import { FiAlertCircle, FiCheckSquare } from "react-icons/fi";
import { type AirtableTable } from "@/entities/airtable/airtable.service";

const SUPPORTED_FIELD_TYPES = [
  "singleLineText",
  "multilineText",
  "singleSelect",
  "multipleSelects",
  "richText",
  "attachment",
];

interface Step3_SelectFieldsProps {
  selectedTable: AirtableTable | null;
  selectedFields: Record<string, boolean>;
  hasSelectedFields: boolean;
  onFieldToggle: (fieldId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3_SelectFields = ({
  selectedTable,
  selectedFields,
  hasSelectedFields,
  onFieldToggle,
  onNext,
  onBack,
}: Step3_SelectFieldsProps) => {
  const supportedFields =
    selectedTable?.fields.filter((field) =>
      SUPPORTED_FIELD_TYPES.includes(field.type)
    ) || [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Step 3: Select Fields
      </h2>
      <p className="mt-1 text-gray-600">
        Choose the fields to include in your form.
      </p>

      {supportedFields.length > 0 ? (
        <div className="mt-6 border rounded-md divide-y">
          {supportedFields.map((field) => (
            <label
              key={field.id}
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={!!selectedFields[field.id]}
                onChange={() => onFieldToggle(field.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">{field.name}</p>
                <p className="text-sm text-gray-500">{field.type}</p>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center border-2 border-dashed border-gray-300 p-8 rounded-lg">
          <FiAlertCircle className="mx-auto w-12 h-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No supported fields found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This table does not have any fields of the supported types.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!hasSelectedFields}
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
        >
          <FiCheckSquare className="inline-block mr-2" />
          Finish
        </button>
      </div>
    </div>
  );
};

export default Step3_SelectFields;
