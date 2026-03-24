import mongoose from "mongoose"

const StaffSchema = new mongoose.Schema(
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
    roleVisible: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema)
