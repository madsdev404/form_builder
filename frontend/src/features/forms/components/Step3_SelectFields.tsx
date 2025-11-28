import { useState } from "react";
import { FiAlertCircle, FiCheckSquare, FiLoader, FiPlus } from "react-icons/fi";
import {
  type AirtableTable,
  type IChoice,
} from "@/entities/airtable/airtable.service";
import { type IConditionalRules } from "../form.service";
import ConditionalLogicBuilder from "./ConditionalLogicBuilder";

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
  formName: string;
  onFormNameChange: (name: string) => void;
  questionLabels: Record<string, string>;
  onLabelChange: (fieldId: string, label: string) => void;
  isSubmitting?: boolean;
  customChoices: Record<string, IChoice[]>;
  onAddCustomChoice: (fieldId: string, choiceName: string) => void;
  conditionalRules: Record<string, IConditionalRules | null>;
  onRulesChange: (fieldId: string, rules: IConditionalRules | null) => void;
}

const Step3_SelectFields = ({
  selectedTable,
  selectedFields,
  hasSelectedFields,
  onFieldToggle,
  onNext,
  onBack,
  formName,
  onFormNameChange,
  questionLabels,
  onLabelChange,
  isSubmitting,
  customChoices,
  onAddCustomChoice,
  conditionalRules,
  onRulesChange,
}: Step3_SelectFieldsProps) => {
  const [newChoiceInputs, setNewChoiceInputs] = useState<
    Record<string, string>
  >({});

  const handleNewChoiceChange = (fieldId: string, value: string) => {
    setNewChoiceInputs((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleAddNewChoice = (fieldId: string) => {
    const choiceName = newChoiceInputs[fieldId];
    if (choiceName && choiceName.trim() !== "") {
      onAddCustomChoice(fieldId, choiceName.trim());
      handleNewChoiceChange(fieldId, "");
    }
  };

  const supportedFields =
    selectedTable?.fields.filter((field) =>
      SUPPORTED_FIELD_TYPES.includes(field.type)
    ) || [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Step 3: Name Your Form & Select Fields
      </h2>
      <p className="mt-1 text-gray-600">
        Finally, give your form a name and choose the fields to include.
      </p>

      <div className="mt-6">
        <label
          htmlFor="formName"
          className="block text-sm font-medium text-gray-700"
        >
          Form Name
        </label>
        <input
          type="text"
          id="formName"
          value={formName}
          onChange={(e) => onFormNameChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Project Signup Form"
        />
      </div>

      {supportedFields.length > 0 ? (
        <div className="mt-6 border rounded-md divide-y">
          {supportedFields.map((field) => {
            const isSelect =
              field.type === "singleSelect" || field.type === "multipleSelects";
            const existingChoices = field.options?.choices || [];
            const newChoices = customChoices[field.id] || [];
            const allChoices = [...existingChoices, ...newChoices];
            const otherQuestions = supportedFields.filter(
              (q) => q.id !== field.id
            );

            return (
              <div key={field.id} className="p-4">
                <label
                  htmlFor={`field-${field.id}`}
                  className="flex items-start gap-4 cursor-pointer"
                >
                  <input
                    id={`field-${field.id}`}
                    type="checkbox"
                    checked={!!selectedFields[field.id]}
                    onChange={() => onFieldToggle(field.id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      {field.name}
                    </span>
                    <p className="text-sm text-gray-500">{field.type}</p>
                  </div>
                </label>
                {selectedFields[field.id] && (
                  <div className="mt-3 ml-9 space-y-4">
                    <div>
                      <label
                        htmlFor={`label-${field.id}`}
                        className="block text-sm font-medium text-gray-600"
                      >
                        Question Label
                      </label>
                      <input
                        type="text"
                        id={`label-${field.id}`}
                        value={questionLabels[field.id] || field.name}
                        onChange={(e) =>
                          onLabelChange(field.id, e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    {isSelect && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Options
                        </label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {allChoices.map((choice) => (
                            <span
                              key={choice.id}
                              className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full"
                            >
                              {choice.name}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={newChoiceInputs[field.id] || ""}
                            onChange={(e) =>
                              handleNewChoiceChange(field.id, e.target.value)
                            }
                            className="grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Add new choice..."
                          />
                          <button
                            type="button"
                            onClick={() => handleAddNewChoice(field.id)}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    )}
                    <ConditionalLogicBuilder
                      fieldId={field.id}
                      rules={conditionalRules[field.id]}
                      onRulesChange={onRulesChange}
                      otherQuestions={otherQuestions}
                    />
                  </div>
                )}
              </div>
            );
          })}
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
          disabled={!hasSelectedFields || !formName || isSubmitting}
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <FiCheckSquare className="inline-block mr-2" />
              Finish
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3_SelectFields;
