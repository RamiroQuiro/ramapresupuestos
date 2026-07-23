import { useStore } from "@nanostores/react";
import { profesional, setProfesionalField } from "../../stores/profesional";
import { Input } from "../../components/ui/atomos/Input";
import { Text } from "../../components/ui/atomos/Text";

export function StepDatosPropios() {
  const data = useStore(profesional);

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" size="lg" weight="semibold" className="mb-2">
        Tus datos
      </Text>
      <Text variant="caption" size="sm" className="-mt-2">
        Se guardan localmente para futuros presupuestos.
      </Text>

      <Input
        label="Nombre / Empresa"
        placeholder="Ej: Rama Construcciones"
        value={data.nombre}
        onChange={(e) => setProfesionalField("nombre", e.target.value)}
      />

      <Input
        label="Título / Rubro"
        placeholder="Ej: Electricista matriculado"
        value={data.titulo}
        onChange={(e) => setProfesionalField("titulo", e.target.value)}
      />

      <Input
        label="Teléfono"
        type="tel"
        placeholder="Ej: 11 5555 1234"
        value={data.telefono}
        onChange={(e) => setProfesionalField("telefono", e.target.value)}
      />

      <Input
        label="Email (opcional)"
        type="email"
        placeholder="Ej: contacto@rama.com"
        value={data.email}
        onChange={(e) => setProfesionalField("email", e.target.value)}
      />

      <Input
        label="Dirección (opcional)"
        placeholder="Ej: Av. San Martín 500"
        value={data.direccion}
        onChange={(e) => setProfesionalField("direccion", e.target.value)}
      />
    </div>
  );
}
