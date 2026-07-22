import { useStore } from "@nanostores/react";
import { presupuesto, getTotal, resetPresupuesto, currentStep } from "@/stores/presupuesto";
import { Button } from "@/components/ui/atomos/Button";
import { Text } from "@/components/ui/atomos/Text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/organismo/Card";

export function StepResumen() {
  const data = useStore(presupuesto);
  const step = useStore(currentStep);
  const total = getTotal();

  const handleCompartir = async () => {
    const texto = generarTextoPresupuesto();
    if (navigator.share) {
      await navigator.share({
        title: "Presupuesto",
        text: texto,
      });
    } else {
      await navigator.clipboard.writeText(texto);
      alert("Presupuesto copiado al portapapeles");
    }
  };

  const handleNuevo = () => {
    resetPresupuesto();
  };

  const generarTextoPresupuesto = (): string => {
    let texto = `Presupuesto para: ${data.cliente.nombre}\n`;
    if (data.cliente.telefono) texto += `Tel: ${data.cliente.telefono}\n`;
    texto += `\nServicios:\n`;
    data.servicios.forEach((s) => {
      texto += `- ${s.descripcion}: ${s.cantidad} x $${s.precioUnitario.toLocaleString("es-AR")} = $${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}\n`;
    });
    texto += `\nTotal: $${total.toLocaleString("es-AR")}`;
    return texto;
  };

  if (step !== 3) return null;

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" size="lg" weight="semibold">
        Resumen del presupuesto
      </Text>

      {/* Datos del cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <Text size="base" weight="semibold">{data.cliente.nombre}</Text>
            {data.cliente.telefono && (
              <Text variant="caption" size="sm">Tel: {data.cliente.telefono}</Text>
            )}
            {data.cliente.email && (
              <Text variant="caption" size="sm">{data.cliente.email}</Text>
            )}
            {data.cliente.direccion && (
              <Text variant="caption" size="sm">{data.cliente.direccion}</Text>
            )}
            {data.cliente.notas && (
              <Text variant="caption" size="sm" className="mt-2 italic">
                {data.cliente.notas}
              </Text>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {data.servicios.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b border-primary-border pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <Text size="sm" weight="medium">{s.descripcion}</Text>
                  <Text variant="caption" size="xs">
                    {s.cantidad} x ${s.precioUnitario.toLocaleString("es-AR")}
                  </Text>
                </div>
                <Text size="sm" weight="semibold">
                  ${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}
                </Text>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Total */}
      <div className="rounded-xl border-2 border-primary-100 bg-primary-100/10 p-4">
        <div className="flex items-center justify-between">
          <Text size="lg" weight="bold">Total</Text>
          <Text size="2xl" weight="bold" className="text-primary-100">
            ${total.toLocaleString("es-AR")}
          </Text>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        <Button onClick={handleCompartir} className="w-full" size="lg">
          Compartir presupuesto
        </Button>
        <Button variant="outline" onClick={handleNuevo} className="w-full">
          Crear otro presupuesto
        </Button>
      </div>
    </div>
  );
}
