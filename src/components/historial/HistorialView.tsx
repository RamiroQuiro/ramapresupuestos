import { useState } from "react";
import { useStore } from "@nanostores/react";
import { historial, eliminarPresupuesto } from "../../stores/historial";
import { Button } from "../ui/atomos/Button";
import { Text } from "../ui/atomos/Text";
import { Card, CardContent } from "../ui/organismo/Card";
import handleDescargarPDF from "../../lib/templatesPdf/presupuesto";
import type { HistorialItem } from "../../stores/historial";

const ITEMS_PER_PAGE = 15;

export function HistorialView() {
  const items = useStore(historial);
  const [pagina, setPagina] = useState(1);
  const [expandido, setExpandido] = useState<string | null>(null);

  const totalPaginas = Math.ceil(items.length / ITEMS_PER_PAGE);
  const itemsVisibles = items.slice(0, pagina * ITEMS_PER_PAGE);
  const hayMas = pagina < totalPaginas;

  const formatearFecha = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWhatsApp = (item: HistorialItem) => {
    const p = item.profesional;
    let msg = "";
    if (p.nombre) msg += `*${p.nombre}*`;
    if (p.titulo) msg += ` — ${p.titulo}`;
    if (p.nombre || p.titulo) msg += "\n";
    msg += "\n";
    msg += `Presupuesto para *${item.cliente.nombre}*\n`;
    msg += "\n";
    msg += "━━━━━━━━━━━━━━━━━━━\n";
    item.servicios.forEach((s) => {
      msg += `• ${s.descripcion}\n`;
      msg += `  ${s.cantidad} x $${s.precioUnitario.toLocaleString("es-AR")} = *$${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}*\n`;
    });
    msg += "━━━━━━━━━━━━━━━━━━━\n";
    msg += `\n*Total: $${item.total.toLocaleString("es-AR")}*\n`;
    if (p.telefono) msg += `\nConsultas: ${p.telefono}`;

    const mensaje = encodeURIComponent(msg);
    const phone = item.cliente.telefono?.replace(/\D/g, "") || "";
    const url = phone
      ? `https://wa.me/${phone}?text=${mensaje}`
      : `https://wa.me/?text=${mensaje}`;
    window.open(url, "_blank");
  };

  const handleCompartir = async (item: HistorialItem) => {
    const p = item.profesional;
    let texto = "";
    if (p.nombre) texto += `${p.nombre}`;
    if (p.titulo) texto += ` — ${p.titulo}`;
    if (p.nombre || p.titulo) texto += "\n";
    if (p.telefono) texto += `Tel: ${p.telefono}\n`;
    if (p.email) texto += `Email: ${p.email}\n`;
    if (p.nombre || p.titulo || p.telefono || p.email) texto += "\n";

    texto += `Presupuesto para: ${item.cliente.nombre}\n`;
    if (item.cliente.telefono) texto += `Tel: ${item.cliente.telefono}\n`;
    texto += `\nServicios:\n`;
    item.servicios.forEach((s) => {
      texto += `- ${s.descripcion}: ${s.cantidad} x $${s.precioUnitario.toLocaleString("es-AR")} = $${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}\n`;
    });
    texto += `\nTotal: $${item.total.toLocaleString("es-AR")}`;

    if (navigator.share) {
      await navigator.share({ title: "Presupuesto", text: texto });
    } else {
      try {
        await navigator.clipboard.writeText(texto);
      } catch {
        prompt("Copiá este texto:", texto);
      }
    }
  };

  const handleDescargar = (item: HistorialItem) => {
    handleDescargarPDF(
      { cliente: item.cliente, servicios: item.servicios },
      item.profesional,
      item.total
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Text as="h1" size="xl" weight="bold">
        Historial
      </Text>
      <Text variant="caption" size="sm">
        {items.length} presupuesto{items.length !== 1 ? "s" : ""}
        {items.length >= 100 ? " (máximo 100)" : ""}
      </Text>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <Text variant="caption" size="sm">
            Sin presupuestos guardados
          </Text>
          <Text variant="caption" size="xs">
            Creá tu primer presupuesto en "Nuevo"
          </Text>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {itemsVisibles.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <button
                    onClick={() =>
                      setExpandido(expandido === item.id ? null : item.id)
                    }
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text size="base" weight="semibold">
                          {item.cliente.nombre}
                        </Text>
                        <Text variant="caption" size="xs">
                          {formatearFecha(item.fecha)}
                        </Text>
                      </div>
                      <Text size="base" weight="bold" className="text-primary-100">
                        ${item.total.toLocaleString("es-AR")}
                      </Text>
                    </div>
                  </button>

                  {expandido === item.id && (
                    <div className="mt-3 border-t border-primary-border pt-3">
                      <Text variant="caption" size="xs" weight="semibold">
                        Servicios:
                      </Text>
                      {item.servicios.map((s) => (
                        <div key={s.id} className="flex justify-between py-1">
                          <Text variant="caption" size="xs">
                            {s.descripcion} x{s.cantidad}
                          </Text>
                          <Text variant="caption" size="xs">
                            ${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}
                          </Text>
                        </div>
                      ))}
                      <div className="mt-3 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDescargar(item)}
                        >
                          Descargar PDF
                        </Button>
                        <Button
                          size="sm"
                          className="w-full bg-[#25D366] hover:bg-[#1da851] text-white"
                          onClick={() => handleWhatsApp(item)}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleCompartir(item)}
                        >
                          Compartir
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-400 hover:text-red-300"
                          onClick={() => eliminarPresupuesto(item.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {hayMas && (
            <Button
              variant="outline"
              onClick={() => setPagina(pagina + 1)}
              className="w-full"
            >
              Cargar más ({itemsVisibles.length} de {items.length})
            </Button>
          )}
        </>
      )}
    </div>
  );
}
