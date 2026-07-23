import { atom } from "nanostores";
import { uuid } from "../utils";

export interface Servicio {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

export interface PresupuestoData {
  cliente: {
    nombre: string;
    telefono: string;
    email: string;
    direccion: string;
    notas: string;
  };
  servicios: Servicio[];
}

const initialState: PresupuestoData = {
  cliente: {
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    notas: "",
  },
  servicios: [],
};

export const currentStep = atom(0);
export const presupuesto = atom<PresupuestoData>({ ...initialState });

export function setClienteField(field: keyof PresupuestoData["cliente"], value: string) {
  presupuesto.set({
    ...presupuesto.get(),
    cliente: {
      ...presupuesto.get().cliente,
      [field]: value,
    },
  });
}

export function addServicio() {
  const data = presupuesto.get();
  const newServicio: Servicio = {
    id: uuid(),
    descripcion: "",
    cantidad: 1,
    precioUnitario: 0,
  };
  presupuesto.set({
    ...data,
    servicios: [...data.servicios, newServicio],
  });
}

export function addServicioFromCatalogo(nombre: string, precioUnitario: number) {
  const data = presupuesto.get();
  const newServicio: Servicio = {
    id: uuid(),
    descripcion: nombre,
    cantidad: 1,
    precioUnitario,
  };
  presupuesto.set({
    ...data,
    servicios: [...data.servicios, newServicio],
  });
}

export function updateServicio(id: string, field: keyof Servicio, value: string | number) {
  const data = presupuesto.get();
  presupuesto.set({
    ...data,
    servicios: data.servicios.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    ),
  });
}

export function removeServicio(id: string) {
  const data = presupuesto.get();
  presupuesto.set({
    ...data,
    servicios: data.servicios.filter((s) => s.id !== id),
  });
}

export function getTotal(): number {
  return presupuesto.get().servicios.reduce(
    (sum, s) => sum + s.cantidad * s.precioUnitario,
    0
  );
}

export function nextStep() {
  const step = currentStep.get();
  if (step < 3) currentStep.set(step + 1);
}

export function prevStep() {
  const step = currentStep.get();
  if (step > 0) currentStep.set(step - 1);
}

export function resetPresupuesto() {
  currentStep.set(0);
  presupuesto.set({ ...initialState });
}
