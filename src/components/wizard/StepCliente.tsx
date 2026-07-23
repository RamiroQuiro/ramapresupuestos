import { useStore } from "@nanostores/react";
import { presupuesto, setClienteField } from "../../stores/presupuesto";
import { Input, Textarea } from "../../components/ui/atomos/Input";
import { Text } from "../../components/ui/atomos/Text";

export function StepCliente() {
  const data = useStore(presupuesto);

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" size="lg" weight="semibold" className="mb-2">
        Datos del cliente
      </Text>

      <Input
        label="Nombre"
        placeholder="Ej: Juan Pérez"
        value={data.cliente.nombre}
        onChange={(e) => setClienteField("nombre", e.target.value)}
      />

      <Input
        label="Teléfono"
        type="tel"
        placeholder="Ej: 11 5555 1234"
        value={data.cliente.telefono}
        onChange={(e) => setClienteField("telefono", e.target.value)}
      />

      <Input
        label="Email (opcional)"
        type="email"
        placeholder="Ej: juan@email.com"
        value={data.cliente.email}
        onChange={(e) => setClienteField("email", e.target.value)}
      />

      <Input
        label="Dirección (opcional)"
        placeholder="Ej: Av. Corrientes 1234"
        value={data.cliente.direccion}
        onChange={(e) => setClienteField("direccion", e.target.value)}
      />

      <Textarea
        label="Notas (opcional)"
        placeholder="Detalles adicionales del trabajo..."
        value={data.cliente.notas}
        onChange={(e) => setClienteField("notas", e.target.value)}
        rows={3}
      />
    </div>
  );
}
