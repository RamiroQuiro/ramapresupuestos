import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  presupuesto,
  addServicio,
  addServicioFromCatalogo,
  updateServicio,
  removeServicio,
  getTotal,
} from "@/stores/presupuesto";
import { catalogo } from "@/stores/catalogo";
import { Input } from "@/components/ui/atomos/Input";
import { Button } from "@/components/ui/atomos/Button";
import { Text } from "@/components/ui/atomos/Text";
import { Card, CardContent } from "../ui/organismo/Card";

export function StepServicios() {
  const data = useStore(presupuesto);
  const catalogoItems = useStore(catalogo);
  const total = getTotal();
  const [busqueda, setBusqueda] = useState("");
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);

  const categorias = [...new Set(catalogoItems.map((i) => i.categoria))].sort();
  const itemsFiltrados = busqueda
    ? catalogoItems.filter(
        (i) =>
          i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          i.categoria.toLowerCase().includes(busqueda.toLowerCase())
      )
    : catalogoItems;

  const handleAgregarDesdeCatalogo = (nombre: string, precio: number) => {
    addServicioFromCatalogo(nombre, precio);
    setMostrarCatalogo(false);
    setBusqueda("");
  };

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
        <Card key={servicio.id}>
          <CardContent>
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
          </CardContent>
        </Card>
      ))}

      {/* Botones de agregar */}
      <div className="flex flex-col gap-2">
        {catalogoItems.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setMostrarCatalogo(!mostrarCatalogo)}
            className="w-full"
          >
            {mostrarCatalogo ? "Cerrar catálogo" : "Elegir del catálogo"}
          </Button>
        )}

        <Button variant="outline" onClick={addServicio} className="w-full">
          + Agregar
        </Button>
      </div>

      {/* Panel del catálogo */}
      {mostrarCatalogo && (
        <Card>
          <CardContent>
            <Input
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="mt-3 flex max-h-60 flex-col gap-2 overflow-y-auto">
              {itemsFiltrados.length === 0 ? (
                <Text variant="caption" size="sm" className="py-4 text-center">
                  {busqueda ? "Sin resultados" : "Tu catálogo está vacío"}
                </Text>
              ) : (
                categorias.map((cat) => {
                  const catItems = itemsFiltrados.filter((i) => i.categoria === cat);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat} className="flex flex-col gap-1">
                      <Text variant="caption" size="xs" weight="semibold" className="text-primary-100">
                        {cat}
                      </Text>
                      {catItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAgregarDesdeCatalogo(item.nombre, item.precioUnitario)}
                          className="flex items-center justify-between rounded-lg border border-primary-border p-2 text-left transition-colors hover:border-primary-100 hover:bg-primary-100/5"
                        >
                          <Text size="sm">{item.nombre}</Text>
                          <Text size="sm" weight="semibold">
                            ${item.precioUnitario.toLocaleString("es-AR")}
                          </Text>
                        </button>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
