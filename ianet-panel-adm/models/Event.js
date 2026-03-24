import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
    time: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    responsible: {
      type: String,
      default: "",
    },
    assignedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Event || mongoose.model("Event", EventSchema)
