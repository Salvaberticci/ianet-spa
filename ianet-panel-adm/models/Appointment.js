import mongoose from "mongoose"

const AppointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "El nombre del paciente es requerido"],
    },
    patientEmail: {
      type: String,
      required: [true, "El email del paciente es requerido"],
    },
    patientPhone: {
      type: String,
      required: [true, "El teléfono del paciente es requerido"],
    },
    type: {
      type: String,
      enum: ["atencion-ciudadano", "valoracion-nutricional"],
      required: [true, "El tipo de cita es requerido"],
    },
    dateTime: {
      type: Date,
      required: [true, "La fecha y hora son requeridas"],
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    status: {
      type: String,
      enum: ["solicitada", "confirmada", "atendida", "cancelada"],
      default: "solicitada",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Índices para consultas por paciente y orden por fecha
AppointmentSchema.index({ patientEmail: 1, dateTime: -1 })

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)
