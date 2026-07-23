import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  catalogo,
  addCatalogoItem,
  updateCatalogoItem,
  removeCatalogoItem,
} from "../../stores/catalogo";
import { profesional } from "../../stores/profesional";
import { Input } from "../ui/atomos/Input";
import { Button } from "../ui/atomos/Button";
import { Text } from "../ui/atomos/Text";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/organismo/Card";
import { Share2 } from "lucide-react";
import { encodeCatalogo } from "../../lib/catalogoCompartir";

export function CatalogoView() {
  const items = useStore(catalogo);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const categorias = [...new Set(items.map((i) => i.categoria))].sort();
  const itemsFiltrados = busqueda
    ? items.filter(
        (i) =>
          i.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          i.categoria.toLowerCase().includes(busqueda.toLowerCase())
      )
    : items;

  const itemsAgrupados = categorias.reduce((acc, cat) => {
    acc[cat] = itemsFiltrados.filter((i) => i.categoria === cat);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !categoria.trim() || !precio) return;

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) return;

    if (editando) {
      updateCatalogoItem(editando, {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precioUnitario: precioNum,
      });
      setEditando(null);
    } else {
      addCatalogoItem({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precioUnitario: precioNum,
      });
    }

    setNombre("");
    setPrecio("");
  };

  const handleEditar = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setEditando(id);
    setNombre(item.nombre);
    setCategoria(item.categoria);
    setPrecio(String(item.precioUnitario));
  };

  const handleCancelar = () => {
    setEditando(null);
    setNombre("");
    setCategoria("");
    setPrecio("");
  };

  const handleCompartirCatalogo = async () => {
    const pro = profesional.get();
    const encoded = encodeCatalogo(pro.nombre, pro.telefono, items);
    if (!encoded) return;
    const url = `${window.location.origin}/publico#${encoded}`;
    if (navigator.share) {
      await navigator.share({ title: "Catálogo", text: `Mirá mi catálogo: ${url}` });
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        prompt("Copiá este enlace:", url);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
   

      {items.length > 0 && (
        <Button
          onClick={handleCompartirCatalogo}
          variant="outline"
          className="w-full gap-2"
        >
          <Share2 size={16} />
          Compartir catálogo
        </Button>
      )}

      {/* Formulario */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Nombre del servicio"
              placeholder="Ej: Servicio de cabina 2hs"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              label="Categoría"
              placeholder="Ej: Cabina, Iluminación, Sonido..."
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              list="categorias"
            />
            <datalist id="categorias">
              {categorias.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <Input
              label="Precio unitario"
              type="number"
              placeholder="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="0"
              step="100"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editando ? "Guardar cambios" : "Agregar al catálogo"}
              </Button>
              {editando && (
                <Button type="button" variant="outline" onClick={handleCancelar}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Búsqueda */}
      {items.length > 0 && (
        <Input
          placeholder="Buscar servicio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      )}

      {/* Lista agrupada por categoría */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <Text variant="caption" size="sm">
            Tu catálogo está vacío
          </Text>
          <Text variant="caption" size="xs">
            Agregá servicios arriba para empezar
          </Text>
        </div>
      ) : (
        Object.entries(itemsAgrupados).map(([cat, catItems]) => (
          <div key={cat} className="flex flex-col gap-2">
            <Text variant="caption" size="xs" weight="semibold" className="text-primary-100 uppercase tracking-wider">
              {cat}
            </Text>
            {catItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Text size="sm" weight="medium">{item.nombre}</Text>
                    <Text variant="caption" size="xs">
                      ${item.precioUnitario.toLocaleString("es-AR")}
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditar(item.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => removeCatalogoItem(item.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
