import mongoose from "mongoose"

const InventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
    },
    type: {
      type: String,
      enum: ["medicina", "alimento"],
      required: [true, "El tipo es requerido"],
    },
    description: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "La unidad es requerida"],
      default: "unidades",
    },
    expirationDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema)
