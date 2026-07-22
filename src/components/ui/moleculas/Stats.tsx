import React from "react";
import { Card, CardContent } from "../organisms/Card";

type Props = {
  infoValor: string;
  infoTitulo: string;
  infoDescripcion: string;
  icono: React.ReactNode;
  color: string;
};

export default function Stats({
  infoValor,
  infoTitulo,
  infoDescripcion,
  icono,
  color = "text-primary-100",
}: Props) {
  const Icono = icono;
  return (
    <Card className="border-primary-border shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-texto text-sm">{infoTitulo}</p>
            <h3 className="text-primary-textoTitle mt-2 text-2xl font-bold">
              {infoValor}
            </h3>
            <p className="text-primary-texto mt-1 text-xs">{infoDescripcion}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100/50">
            <Icono className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
