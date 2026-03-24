import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
    },
    phone: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "El asunto es requerido"],
    },
    message: {
      type: String,
      required: [true, "El mensaje es requerido"],
    },
    status: {
      type: String,
      enum: ["nuevo", "en_proceso", "resuelto"],
      default: "nuevo",
    },
    internalNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema)
