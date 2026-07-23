import { useStore } from "@nanostores/react";
import { profesional, setProfesionalField } from "../../stores/profesional";
import { Input } from "../ui/atomos/Input";
import { Text } from "../ui/atomos/Text";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/organismo/Card";
import { User, Info } from "lucide-react";

export function ConfigView() {
  const data = useStore(profesional);

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Text as="h1" size="xl" weight="bold">
        Configuración
      </Text>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} />
            Tus datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={18} />
            Información
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1 text-sm text-primary-texto">
            <Text variant="caption" size="sm">
              ramaPresupuesto v0.1
            </Text>
            <Text variant="caption" size="sm">
              Los datos se guardan localmente en el navegador.
            </Text>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
