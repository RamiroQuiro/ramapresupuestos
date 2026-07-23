import { useEffect, useState } from "react";
import { decodeCatalogo, type CatalogoCompartido } from "../../lib/catalogoCompartir";
import { Button } from "../ui/atomos/Button";
import { Text } from "../ui/atomos/Text";
import { Card, CardContent } from "../ui/organismo/Card";
import { Minus, Plus, MessageCircle, AlertCircle } from "lucide-react";

export function PublicCatalogoView() {
  const [data, setData] = useState<CatalogoCompartido | null>(null);
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [nota, setNota] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setError(true);
      return;
    }
    const decoded = decodeCatalogo(hash);
    if (!decoded) {
      setError(true);
      return;
    }
    setData(decoded);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-screen text-center">
        <AlertCircle size={48} className="text-red-400" />
        <Text size="lg" weight="semibold">
          Link inválido
        </Text>
        <Text variant="caption" size="sm">
          Este link de catálogo no es válido o está corrupto.
        </Text>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen">
        <Text variant="caption" size="sm">
          Cargando...
        </Text>
      </div>
    );
  }

  const categorias = [...new Set(data.i.map((item) => item.cat))].sort();

  const total = data.i.reduce((sum, item, idx) => {
    return sum + (cantidades[idx] || 0) * item.p;
  }, 0);

  const itemsSeleccionados = data.i.filter((_, idx) => (cantidades[idx] || 0) > 0);

  const handleWhatsApp = () => {
    let msg = `Hola ${data.n}, quiero consultar por:\n`;
    itemsSeleccionados.forEach((item, idx) => {
      const cant = cantidades[idx] || 0;
      msg += `\n• ${item.nom} x${cant} = $${(cant * item.p).toLocaleString("es-AR")}`;
    });
    msg += `\n\nTotal: $${total.toLocaleString("es-AR")}`;
    if (nota.trim()) {
      msg += `\n\nNota: ${nota.trim()}`;
    }

    const mensaje = encodeURIComponent(msg);
    const url = data.t
      ? `https://wa.me/${data.t.replace(/\D/g, "")}?text=${mensaje}`
      : `https://wa.me/?text=${mensaje}`;
    window.open(url, "_blank");
  };

  const handleCantidad = (idx: number, delta: number) => {
    setCantidades((prev) => {
      const actual = prev[idx] || 0;
      const nuevo = Math.max(0, actual + delta);
      if (nuevo === 0) {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      }
      return { ...prev, [idx]: nuevo };
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="text-center">
        <Text as="h1" size="xl" weight="bold">
          {data.n || "Catálogo"}
        </Text>
        <Text variant="caption" size="sm">
          Seleccioná los servicios que necesites
        </Text>
      </div>

      {categorias.map((cat) => (
        <div key={cat} className="flex flex-col gap-2">
          <Text
            variant="caption"
            size="xs"
            weight="semibold"
            className="text-primary-100 uppercase tracking-wider"
          >
            {cat}
          </Text>
          {data.i
            .map((item, idx) => ({ item, idx }))
            .filter(({ item }) => item.cat === cat)
            .map(({ item, idx }) => (
              <Card key={idx}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Text size="sm" weight="medium">
                      {item.nom}
                    </Text>
                    <Text variant="caption" size="xs">
                      ${item.p.toLocaleString("es-AR")} c/u
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCantidad(idx, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300/50 text-white hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <Text size="base" weight="bold" className="w-8 text-center">
                      {cantidades[idx] || 0}
                    </Text>
                    <button
                      onClick={() => handleCantidad(idx, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white hover:bg-primary-100/90 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ))}

      {itemsSeleccionados.length > 0 && (
        <div className="rounded-xl border-2 border-primary-100 bg-primary-100/10 p-4">
          <div className="flex items-center justify-between">
            <Text size="lg" weight="bold">
              Total
            </Text>
            <Text size="2xl" weight="bold" className="text-primary-100">
              ${total.toLocaleString("es-AR")}
            </Text>
          </div>
        </div>
      )}

      {itemsSeleccionados.length > 0 && (
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Agregá una nota (opcional)..."
          className="w-full rounded-sm border border-gray-300/50 bg-transparent p-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-100"
          rows={3}
        />
      )}

      <Button
        onClick={handleWhatsApp}
        disabled={itemsSeleccionados.length === 0}
        size="lg"
        className="w-full gap-2 bg-[#25D366] hover:bg-[#1da851] text-white"
      >
        <MessageCircle size={20} />
        Consultar por WhatsApp
      </Button>
    </div>
  );
}
