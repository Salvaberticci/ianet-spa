import mongoose from "mongoose"

const NutritionalDataSchema = new mongoose.Schema(
  {
    patientEmail: {
      type: String,
      required: [true, "El email del paciente es requerido"],
      index: true,
    },
    patientName: {
      type: String,
      required: [true, "El nombre del paciente es requerido"],
    },
    date: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
    weight: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    bmi: {
      type: Number,
      default: null,
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

// Índice para consultas por paciente y fecha
NutritionalDataSchema.index({ patientEmail: 1, date: -1 })

export default mongoose.models.NutritionalData || mongoose.model("NutritionalData", NutritionalDataSchema)

