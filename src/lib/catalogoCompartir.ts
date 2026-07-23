export interface CatalogoCompartido {
  n: string;
  t: string;
  i: { nom: string; cat: string; p: number }[];
}

export function encodeCatalogo(nombre: string, telefono: string, items: { nombre: string; categoria: string; precioUnitario: number }[]): string {
  const data: CatalogoCompartido = {
    n: nombre,
    t: telefono,
    i: items.map((item) => ({
      nom: item.nombre,
      cat: item.categoria,
      p: item.precioUnitario,
    })),
  };
  try {
    return btoa(JSON.stringify(data));
  } catch {
    return "";
  }
}

export function decodeCatalogo(hash: string): CatalogoCompartido | null {
  try {
    const json = atob(hash);
    const data = JSON.parse(json);
    if (
      typeof data.n === "string" &&
      Array.isArray(data.i) &&
      data.i.every((item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).nom === "string" &&
        typeof (item as Record<string, unknown>).p === "number"
      )
    ) {
      return data as CatalogoCompartido;
    }
  } catch {
    // ignore
  }
  return null;
}
