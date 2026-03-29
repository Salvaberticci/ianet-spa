import mongoose from "mongoose"

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "La clave es requerida"],
      unique: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "El valor es requerido"],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema)
