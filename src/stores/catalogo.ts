import { atom } from "nanostores";

export interface CatalogoItem {
  id: string;
  nombre: string;
  categoria: string;
  precioUnitario: number;
}

const STORAGE_KEY = "ramapresupuesto_catalogo";

function loadFromStorage(): CatalogoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(items: CatalogoItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const catalogo = atom<CatalogoItem[]>(loadFromStorage());

catalogo.subscribe((value) => {
  saveToStorage(value);
});

export function addCatalogoItem(item: Omit<CatalogoItem, "id">) {
  const newItem: CatalogoItem = {
    ...item,
    id: crypto.randomUUID(),
  };
  catalogo.set([...catalogo.get(), newItem]);
}

export function updateCatalogoItem(id: string, updates: Partial<Omit<CatalogoItem, "id">>) {
  catalogo.set(
    catalogo.get().map((item) =>
      item.id === id ? { ...item, ...updates } : item
    )
  );
}

export function removeCatalogoItem(id: string) {
  catalogo.set(catalogo.get().filter((item) => item.id !== id));
}
