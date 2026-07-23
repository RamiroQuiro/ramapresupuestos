import { atom } from "nanostores";
import type { PresupuestoData } from "./presupuesto";
import type { ProfesionalData } from "./profesional";
import { uuid } from "../utils";

export interface HistorialItem {
  id: string;
  fecha: string;
  cliente: PresupuestoData["cliente"];
  servicios: PresupuestoData["servicios"];
  profesional: ProfesionalData;
  total: number;
}

const STORAGE_KEY = "ramapresupuesto_historial";
const MAX_ITEMS = 100;

function esHistorialItem(valor: unknown): valor is HistorialItem {
  if (!valor || typeof valor !== "object") return false;
  const item = valor as Record<string, unknown>;
  if (typeof item.id !== "string") return false;
  if (typeof item.fecha !== "string") return false;
  if (!item.cliente || typeof item.cliente !== "object") return false;
  const c = item.cliente as Record<string, unknown>;
  if (typeof c.nombre !== "string") return false;
  if (typeof c.telefono !== "string") return false;
  if (typeof c.email !== "string") return false;
  if (typeof c.direccion !== "string") return false;
  if (typeof c.notas !== "string") return false;
  if (!Array.isArray(item.servicios)) return false;
  for (const s of item.servicios) {
    if (!s || typeof s !== "object") return false;
    const sv = s as Record<string, unknown>;
    if (typeof sv.id !== "string") return false;
    if (typeof sv.descripcion !== "string") return false;
    if (typeof sv.cantidad !== "number") return false;
    if (typeof sv.precioUnitario !== "number") return false;
  }
  if (!item.profesional || typeof item.profesional !== "object") return false;
  const p = item.profesional as Record<string, unknown>;
  if (typeof p.nombre !== "string") return false;
  if (typeof p.titulo !== "string") return false;
  if (typeof p.telefono !== "string") return false;
  if (typeof p.email !== "string") return false;
  if (typeof p.direccion !== "string") return false;
  if (typeof item.total !== "number") return false;
  return true;
}

function loadFromStorage(): HistorialItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(esHistorialItem)) {
        return parsed;
      }
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(items: HistorialItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const historial = atom<HistorialItem[]>(loadFromStorage());

historial.subscribe((value) => {
  saveToStorage(value);
});

export function guardarPresupuesto(
  data: PresupuestoData,
  proData: ProfesionalData,
  total: number
) {
  const nuevo: HistorialItem = {
    id: uuid(),
    fecha: new Date().toISOString(),
    cliente: { ...data.cliente },
    servicios: data.servicios.map((s) => ({ ...s })),
    profesional: { ...proData },
    total,
  };

  const actual = historial.get();
  const nuevoHistorial = [nuevo, ...actual].slice(0, MAX_ITEMS);
  historial.set(nuevoHistorial);
}

export function eliminarPresupuesto(id: string) {
  historial.set(historial.get().filter((item) => item.id !== id));
}
