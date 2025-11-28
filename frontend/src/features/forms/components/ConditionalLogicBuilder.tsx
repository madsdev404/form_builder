import {
  type IConditionalRules,
  type ICondition,
} from "@/features/forms/form.service";
import { type AirtableField } from "@/entities/airtable/airtable.service";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface ConditionalLogicBuilderProps {
  fieldId: string;
  rules: IConditionalRules | null;
  onRulesChange: (fieldId: string, rules: IConditionalRules | null) => void;
  otherQuestions: AirtableField[];
}

const ConditionalLogicBuilder = ({
  rules,
  onRulesChange,
  fieldId,
  otherQuestions,
}: ConditionalLogicBuilderProps) => {
  const handleEnableLogic = () => {
    if (rules) {
      onRulesChange(fieldId, null);
    } else {
      const defaultCondition: ICondition = {
        airtableFieldId: "",
        operator: "equals",
        value: "",
      };
      onRulesChange(fieldId, {
        logic: "AND",
        conditions: [defaultCondition],
      });
    }
  };

  const handleLogicChange = (logic: "AND" | "OR") => {
    if (rules) {
      onRulesChange(fieldId, { ...rules, logic });
    }
  };

  const handleConditionChange = (
    index: number,
    field: keyof ICondition,
    value: string
  ) => {
    if (!rules) return;
    const newConditions = rules.conditions.map((cond, i) => {
      if (i !== index) return cond;
      const updatedCondition = { ...cond };
      switch (field) {
        case "airtableFieldId":
          updatedCondition.airtableFieldId = value;
          break;
        case "operator":
          updatedCondition.operator = value as ICondition["operator"];
          break;
        case "value":
          updatedCondition.value = value;
          break;
      }
      return updatedCondition;
    });
    onRulesChange(fieldId, { ...rules, conditions: newConditions });
  };

  const addCondition = () => {
    if (rules) {
      const newCondition: ICondition = {
        airtableFieldId: "",
        operator: "equals",
        value: "",
      };
      onRulesChange(fieldId, {
        ...rules,
        conditions: [...rules.conditions, newCondition],
      });
    }
  };

  const removeCondition = (index: number) => {
    if (rules) {
      const newConditions = rules.conditions.filter((_, i) => i !== index);
      onRulesChange(fieldId, { ...rules, conditions: newConditions });
    }
  };

  if (!rules) {
    return (
      <button
        type="button"
        onClick={handleEnableLogic}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        + Add Conditional Logic
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-700">Conditional Logic</h4>
        <button
          type="button"
          onClick={handleEnableLogic}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Remove Logic
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Show this question if</span>
          <select
            value={rules.logic}
            onChange={(e) => handleLogicChange(e.target.value as "AND" | "OR")}
            className="text-sm p-1 border border-gray-300 rounded-md"
          >
            <option value="AND">All</option>
            <option value="OR">Any</option>
          </select>
          <span className="text-sm font-medium">of the following match:</span>
        </div>
      </div>

      <div className="space-y-2">
        {rules.conditions.map((condition, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              value={condition.airtableFieldId}
              onChange={(e) =>
                handleConditionChange(index, "airtableFieldId", e.target.value)
              }
              className="grow p-2 border border-gray-300 rounded-md sm:text-sm"
            >
              <option value="">Select a question...</option>
              {otherQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
            <select
              value={condition.operator}
              onChange={(e) =>
                handleConditionChange(index, "operator", e.target.value)
              }
              className="p-2 border border-gray-300 rounded-md sm:text-sm"
            >
              <option value="equals">equals</option>
              <option value="notEquals">not equals</option>
              <option value="contains">contains</option>
            </select>
            <input
              type="text"
              value={condition.value}
              onChange={(e) =>
                handleConditionChange(index, "value", e.target.value)
              }
              className="grow p-2 border border-gray-300 rounded-md sm:text-sm"
              placeholder="Value"
            />
            <button
              type="button"
              onClick={() => removeCondition(index)}
              className="p-2 text-red-500 hover:text-red-700"
              title="Remove condition"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addCondition}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <FiPlus /> Add Condition
      </button>
    </div>
  );
};

export default ConditionalLogicBuilder;
