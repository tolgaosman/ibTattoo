import { adminFetch } from "@/lib/api";

export type AppointmentStatus = "new" | "read" | "archived";

export interface Appointment {
  id: number;
  name: string;
  contact: string;
  idea: string;
  placement: string;
  size: string;
  reference: string | null;
  dates: string | null;
  status: AppointmentStatus;
  createdAt: string;
}

export async function getAppointments(): Promise<Appointment[]> {
  return adminFetch<Appointment[]>("/appointments", { cache: "no-store" });
}
