import { useStore } from "@nanostores/react";
import { currentStep, nextStep, prevStep } from "../../stores/presupuesto";
import { StepCliente } from "./StepCliente";
import { StepServicios } from "./StepServicios";
import { StepResumen } from "./StepResumen";
import { Button } from "../ui/atomos/Button";
import { Text } from "../ui/atomos/Text";

const steps = [
  { num: 1, label: "Cliente" },
  { num: 2, label: "Servicios" },
  { num: 3, label: "Resumen" },
];

export function WizardPresupuesto() {
  const step = useStore(currentStep);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="text-center">
        <Text as="h1" size="xl" weight="bold">
          Nuevo presupuesto
        </Text>
        <Text variant="caption" size="sm" className="mt-1">
          Paso {step} de 3
        </Text>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {steps.map((s) => (
          <div key={s.num} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                s.num <= step ? "bg-primary-100" : "bg-primary-bg-componentes-3"
              }`}
            />
            <Text
              variant="caption"
              size="xs"
              className={`mt-1 text-center ${
                s.num === step ? "text-primary-100 font-semibold" : ""
              }`}
            >
              {s.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1">
        {step === 1 && <StepCliente />}
        {step === 2 && <StepServicios />}
        {step === 3 && <StepResumen />}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-4">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Anterior
          </Button>
        )}
        {step < 3 && (
          <Button onClick={nextStep} className="flex-1">
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
