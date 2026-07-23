import { atom } from "nanostores";

export interface ProfesionalData {
  nombre: string;
  titulo: string;
  telefono: string;
  email: string;
  direccion: string;
}

const STORAGE_KEY = "ramapresupuesto_profesional";

const defaultState: ProfesionalData = {
  nombre: "",
  titulo: "",
  telefono: "",
  email: "",
  direccion: "",
};

function loadFromStorage(): ProfesionalData {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultState;
}

function saveToStorage(data: ProfesionalData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const profesional = atom<ProfesionalData>(loadFromStorage());

profesional.subscribe((value) => {
  saveToStorage(value);
});

export function setProfesionalField(field: keyof ProfesionalData, value: string) {
  profesional.set({
    ...profesional.get(),
    [field]: value,
  });
}
