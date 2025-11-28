import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getBases,
  getTables,
  type AirtableTable,
  type IChoice,
} from "@/entities/airtable/airtable.service";
import { createForm, type IConditionalRules } from "../form.service";
import Step1_SelectBase from "../components/Step1_SelectBase";
import Step2_SelectTable from "../components/Step2_SelectTable";
import Step3_SelectFields from "../components/Step3_SelectFields";

const CreateFormPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<AirtableTable | null>(
    null
  );
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formName, setFormName] = useState("");
  const [questionLabels, setQuestionLabels] = useState<Record<string, string>>(
    {}
  );
  const [customChoices, setCustomChoices] = useState<Record<string, IChoice[]>>(
    {}
  );
  const [conditionalRules, setConditionalRules] = useState<
    Record<string, IConditionalRules | null>
  >({});

  const {
    data: bases,
    isLoading: isLoadingBases,
    isError: isErrorBases,
    error: errorBases,
  } = useQuery({
    queryKey: ["airtableBases"],
    queryFn: getBases,
    enabled: currentStep === 1,
  });

  const {
    data: tables,
    isLoading: isLoadingTables,
    isError: isErrorTables,
    error: errorTables,
  } = useQuery({
    queryKey: ["airtableTables", selectedBaseId],
    queryFn: () => getTables(selectedBaseId!),
    enabled: currentStep === 2 && !!selectedBaseId,
  });

  const mutation = useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      alert(`Error saving form: ${error.message}`);
    },
  });

  const handleNext = () => {
    if (currentStep === 1 && selectedBaseId) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedTable) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const formData = {
        name: formName,
        airtableBaseId: selectedBaseId!,
        airtableTableId: selectedTable!.id,
        questions: Object.keys(selectedFields)
          .filter((fieldId) => selectedFields[fieldId])
          .map((fieldId) => {
            const field = selectedTable!.fields.find((f) => f.id === fieldId);
            const existingChoices = field?.options?.choices || [];
            const newChoices = customChoices[fieldId] || [];
            const allChoices = [...existingChoices, ...newChoices];

            return {
              airtableFieldId: fieldId,
              label: questionLabels[fieldId] || field?.name || "",
              type: field?.type || "",
              options:
                allChoices.length > 0 ? { choices: allChoices } : undefined,
              conditionalRules: conditionalRules[fieldId] || undefined,
            };
          }),
      };
      mutation.mutate(formData);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setSelectedTable(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleTableSelect = (table: AirtableTable) => {
    setSelectedTable(table);
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleLabelChange = (fieldId: string, newLabel: string) => {
    setQuestionLabels((prev) => ({
      ...prev,
      [fieldId]: newLabel,
    }));
  };

  const handleAddCustomChoice = (fieldId: string, choiceName: string) => {
    const newChoice: IChoice = { id: choiceName, name: choiceName };
    setCustomChoices((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), newChoice],
    }));
  };

  const handleRulesChange = (
    fieldId: string,
    rules: IConditionalRules | null
  ) => {
    setConditionalRules((prev) => ({
      ...prev,
      [fieldId]: rules,
    }));
  };

  const hasSelectedFields = useMemo(() => {
    return Object.values(selectedFields).some((isSelected) => isSelected);
  }, [selectedFields]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      {currentStep === 1 && (
        <Step1_SelectBase
          bases={bases}
          isLoading={isLoadingBases}
          isError={isErrorBases}
          error={errorBases}
          selectedBaseId={selectedBaseId}
          onBaseSelect={setSelectedBaseId}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <Step2_SelectTable
          tables={tables}
          isLoading={isLoadingTables}
          isError={isErrorTables}
          error={errorTables}
          selectedTable={selectedTable}
          onTableSelect={handleTableSelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <Step3_SelectFields
          selectedTable={selectedTable}
          selectedFields={selectedFields}
          hasSelectedFields={hasSelectedFields}
          onFieldToggle={handleFieldToggle}
          onNext={handleNext}
          onBack={handleBack}
          formName={formName}
          onFormNameChange={setFormName}
          questionLabels={questionLabels}
          onLabelChange={handleLabelChange}
          isSubmitting={mutation.isPending}
          customChoices={customChoices}
          onAddCustomChoice={handleAddCustomChoice}
          conditionalRules={conditionalRules}
          onRulesChange={handleRulesChange}
        />
      )}
    </div>
  );
};

export default CreateFormPage;
