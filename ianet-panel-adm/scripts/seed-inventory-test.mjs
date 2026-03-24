import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, "../.env.local") })

async function seedInventory() {
    const { default: mongoose } = await import("mongoose")
    await mongoose.connect(process.env.MONGODB_URI)

    const InventorySchema = new mongoose.Schema({
        name: String,
        type: String,
        description: String,
        stock: Number,
        unit: String,
        expirationDate: Date,
        status: String,
    }, { timestamps: true })

    const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema)

    const now = new Date()

    // 1. Expired
    const expiredDate = new Date()
    expiredDate.setDate(now.getDate() - 5)

    // 2. Near expiration (15 days)
    const nearDate = new Date()
    nearDate.setDate(now.getDate() + 15)

    // 3. OK (6 months)
    const okDate = new Date()
    okDate.setMonth(now.getMonth() + 6)

    const items = [
        {
            name: "Amoxicilina 500mg (Vencido)",
            type: "medicina",
            description: "Antibiótico de prueba vencido",
            stock: 50,
            unit: "tabletas",
            expirationDate: expiredDate,
            status: "activo"
        },
        {
            name: "Paracetamol 1g (Por Vencer)",
            type: "medicina",
            description: "Analgésico próximo a vencer",
            stock: 100,
            unit: "tabletas",
            expirationDate: nearDate,
            status: "activo"
        },
        {
            name: "Arroz Integral 1kg (OK)",
            type: "alimento",
            description: "Alimento en buen estado",
            stock: 200,
            unit: "paquetes",
            expirationDate: okDate,
            status: "activo"
        }
    ]

    await Inventory.insertMany(items)
    console.log("✅ Inventario de prueba sembrado")
    await mongoose.disconnect()
}

seedInventory().catch(console.error)
