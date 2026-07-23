import { useStore } from "@nanostores/react";
import { presupuesto, getTotal, resetPresupuesto } from "@/stores/presupuesto";
import { profesional } from "@/stores/profesional";
import { guardarPresupuesto } from "@/stores/historial";
import { Button } from "@/components/ui/atomos/Button";
import { Text } from "@/components/ui/atomos/Text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/organismo/Card";
import { FileDown, MessageCircle, Share2, Plus } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import handleDescargarPDF from "../../lib/templatesPdf/presupuesto";

export function StepResumen() {
  const data = useStore(presupuesto);
  const pro = useStore(profesional);
  const total = getTotal();

  const handleCompartir = async () => {
    const texto = generarTextoPresupuesto();
    if (navigator.share) {
      await navigator.share({
        title: "Presupuesto",
        text: texto,
      });
    } else {
      try {
        await navigator.clipboard.writeText(texto);
        alert("Presupuesto copiado al portapapeles");
      } catch {
        prompt("Copiá este texto:", texto);
      }
    }
  };

  

  const handleNuevo = () => {
    resetPresupuesto();
  };

  const generarMensajeWhatsApp = (): string => {
    let msg = "";
    if (pro.nombre) msg += `*${pro.nombre}*`;
    if (pro.titulo) msg += ` — ${pro.titulo}`;
    if (pro.nombre || pro.titulo) msg += "\n";
    msg += "\n";
    msg += `Presupuesto para *${data.cliente.nombre}*\n`;
    msg += "\n";
    msg += "━━━━━━━━━━━━━━━━━━━\n";
    data.servicios.forEach((s) => {
      msg += `• ${s.descripcion}\n`;
      msg += `  ${s.cantidad} x $${s.precioUnitario.toLocaleString("es-AR")} = *$${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}*\n`;
    });
    msg += "━━━━━━━━━━━━━━━━━━━\n";
    msg += `\n*Total: $${total.toLocaleString("es-AR")}*\n`;
    if (pro.telefono) msg += `\nConsultas: ${pro.telefono}`;
    return msg;
  };

  const handleWhatsApp = () => {
    const mensaje = encodeURIComponent(generarMensajeWhatsApp());
    const phone = data.cliente.telefono?.replace(/\D/g, "") || "";
    const url = phone
      ? `https://wa.me/${phone}?text=${mensaje}`
      : `https://wa.me/?text=${mensaje}`;
    window.open(url, "_blank");
  };

  const generarTextoPresupuesto = (): string => {
    let texto = "";
    if (pro.nombre) texto += `${pro.nombre}`;
    if (pro.titulo) texto += ` — ${pro.titulo}`;
    if (pro.nombre || pro.titulo) texto += "\n";
    if (pro.telefono) texto += `Tel: ${pro.telefono}\n`;
    if (pro.email) texto += `Email: ${pro.email}\n`;
    if (pro.nombre || pro.titulo || pro.telefono || pro.email) texto += "\n";

    texto += `Presupuesto para: ${data.cliente.nombre}\n`;
    if (data.cliente.telefono) texto += `Tel: ${data.cliente.telefono}\n`;
    texto += `\nServicios:\n`;
    data.servicios.forEach((s) => {
      texto += `- ${s.descripcion}: ${s.cantidad} x $${s.precioUnitario.toLocaleString("es-AR")} = $${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}\n`;
    });
    texto += `\nTotal: $${total.toLocaleString("es-AR")}`;
    return texto;
  };

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" size="lg" weight="semibold">
        Resumen del presupuesto
      </Text>

      {/* Datos del profesional */}
      {(pro.nombre || pro.titulo || pro.telefono) && (
        <Card>
          <CardHeader>
            <CardTitle>{pro.nombre || "Tus datos"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              {pro.titulo && (
                <Text variant="caption" size="sm">{pro.titulo}</Text>
              )}
              {pro.telefono && (
                <Text variant="caption" size="sm">Tel: {pro.telefono}</Text>
              )}
              {pro.email && (
                <Text variant="caption" size="sm">{pro.email}</Text>
              )}
              {pro.direccion && (
                <Text variant="caption" size="sm">{pro.direccion}</Text>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
      <div className="rounded-sm border-2 border-primary-100 bg-primary-100/10 p-4">
        <div className="flex items-center justify-between">
          <Text size="lg" weight="bold">Total</Text>
          <Text size="2xl" weight="bold" className="text-primary-100">
            ${total.toLocaleString("es-AR")}
          </Text>
        </div>
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-3 gap-2">
        <Button
className="bg-amber-200 text-black font-gray-500 hover:bg-green-200"
onClick={() => { guardarPresupuesto(data, pro, total); handleDescargarPDF(data, pro, total); }}
          size="sm"
        >
          <FileDown size={20} />
          <span className="text-[10px] leading-tight">PDF</span>
        </Button>
        <Button
          onClick={handleWhatsApp}
          className="bg-green-700 hover:bg-green-500"
          size="sm"
        >
          <MessageCircle size={20} />
          <span className="text-[10px] leading-tight">WhatsApp</span>
        </Button>
        <Button
          onClick={handleCompartir}
          size="sm"
          variant="outline"
        >
          <Share2 size={20} />
          <span className="text-[10px] leading-tight">Compartir</span>
        </Button>
      </div>

      <Button variant="primary" onClick={handleNuevo} className="w-full">
        <Plus size={18} />
        Crear otro presupuesto
      </Button>
    </div>
  );
}
