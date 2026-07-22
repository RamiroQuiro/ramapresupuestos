import { useStore } from "@nanostores/react";
import {
  presupuesto,
  addServicio,
  updateServicio,
  removeServicio,
  getTotal,
} from "@/stores/presupuesto";
import { Input } from "@/components/ui/atomos/Input";
import { Button } from "@/components/ui/atomos/Button";
import { Text } from "@/components/ui/atomos/Text";

export function StepServicios() {
  const data = useStore(presupuesto);
  const total = getTotal();

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" size="lg" weight="semibold">
        Servicios
      </Text>

      {data.servicios.length === 0 && (
        <div className="rounded-xl border border-dashed border-primary-bg-componentes-3 p-8 text-center">
          <Text variant="caption" size="sm">
            Agregá al menos un servicio
          </Text>
        </div>
      )}

      {data.servicios.map((servicio, index) => (
        <div
          key={servicio.id}
          className="rounded-xl border border-primary-border bg-primary-gris p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <Text variant="label" size="sm">
              Servicio {index + 1}
            </Text>
            {data.servicios.length > 1 && (
              <button
                onClick={() => removeServicio(servicio.id)}
                className="text-xs text-red-400 transition-colors hover:text-red-500"
              >
                Eliminar
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Descripción del servicio"
              value={servicio.descripcion}
              onChange={(e) =>
                updateServicio(servicio.id, "descripcion", e.target.value)
              }
            />
            <div className="flex gap-3">
              <div className="w-1/3">
                <Input
                  label="Cant."
                  type="number"
                  min={1}
                  value={servicio.cantidad || ""}
                  onChange={(e) =>
                    updateServicio(
                      servicio.id,
                      "cantidad",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="w-2/3">
                <Input
                  label="Precio unitario"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={servicio.precioUnitario || ""}
                  onChange={(e) =>
                    updateServicio(
                      servicio.id,
                      "precioUnitario",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
            {servicio.cantidad > 0 && servicio.precioUnitario > 0 && (
              <Text variant="label" size="sm" className="text-right">
                Subtotal: ${(servicio.cantidad * servicio.precioUnitario).toLocaleString("es-AR")}
              </Text>
            )}
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addServicio} className="w-full">
        + Agregar servicio
      </Button>

      {data.servicios.length > 0 && (
        <div className="rounded-xl border border-primary-border bg-primary-gris p-4">
          <div className="flex items-center justify-between">
            <Text size="lg" weight="bold">
              Total
            </Text>
            <Text size="xl" weight="bold" className="text-primary-100">
              ${total.toLocaleString("es-AR")}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}
