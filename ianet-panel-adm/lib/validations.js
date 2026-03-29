import { z } from "zod"

export const newsSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  summary: z.string().min(1, "El resumen es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  category: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  status: z.enum(["borrador", "publicada"]),
  publishDate: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  subject: z.string().min(1, "El asunto es requerido"),
  message: z.string().min(1, "El mensaje es requerido"),
})

export const appointmentSchema = z.object({
  patientName: z.string().min(1, "El nombre es requerido"),
  patientEmail: z.string().email("Email inválido"),
  patientPhone: z.string().min(1, "El teléfono es requerido"),
  type: z.enum(["medica", "nutricional"]),
  dateTime: z.string().min(1, "La fecha y hora son requeridas"),
  assignedStaff: z.string().optional(),
  status: z.enum(["solicitada", "confirmada", "atendida", "cancelada"]).optional(),
  notes: z.string().optional(),
})

export const inventorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["medicina", "alimento"]),
  description: z.string().optional(),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  unit: z.string().min(1, "La unidad es requerida"),
  expirationDate: z.string().optional(),
  status: z.enum(["activo", "inactivo"]),
})

export const staffSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  roleVisible: z.string().optional(),
  active: z.boolean().optional(),
})

export const eventSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().optional(),
  location: z.string().optional(),
  responsible: z.string().optional(),
  assignedStaff: z.array(z.string()).optional(),
})

export const nutritionalDataSchema = z.object({
  patientEmail: z.string().email("Email inválido"),
  patientName: z.string().min(1, "El nombre del paciente es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  weight: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  bmi: z.number().min(0).optional().nullable(),
  notes: z.string().optional(),
})

export const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  role: z.enum(["admin", "editor"]),
  active: z.boolean().optional(),
})
