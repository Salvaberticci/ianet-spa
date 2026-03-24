import mongoose from "mongoose"

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
    },
    summary: {
      type: String,
      required: [true, "El resumen es requerido"],
    },
    content: {
      type: String,
      required: [true, "El contenido es requerido"],
    },
    category: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["borrador", "publicada"],
      default: "borrador",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.News || mongoose.model("News", NewsSchema)
