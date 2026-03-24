import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, "../.env.local") })

async function seedStaff() {
    const { default: mongoose } = await import("mongoose")
    await mongoose.connect(process.env.MONGODB_URI)

    // Define schema inline to avoid ESM import issues with the model file
    const StaffSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        roleVisible: { type: String, default: "" },
        active: { type: Boolean, default: true },
    }, { timestamps: true })

    const Staff = mongoose.models.Staff || mongoose.model("Staff", StaffSchema)

    const staffData = [
        { name: "Dra. María González", email: "maria.gonzalez@ianet.gob.ve", phone: "+58-271-1234567", roleVisible: "Médico General", active: true },
        { name: "Dr. Carlos Ramírez", email: "carlos.ramirez@ianet.gob.ve", phone: "+58-271-2345678", roleVisible: "Nutricionista", active: true },
        { name: "Lic. Ana Pérez", email: "ana.perez@ianet.gob.ve", phone: "+58-271-3456789", roleVisible: "Enfermera", active: true },
        { name: "Dr. Luis Mendoza", email: "luis.mendoza@ianet.gob.ve", phone: "+58-271-4567890", roleVisible: "Médico Especialista", active: true },
    ]

    let created = 0
    for (const data of staffData) {
        const existing = await Staff.findOne({ email: data.email })
        if (!existing) {
            await Staff.create(data)
            console.log(`✅ Creado: ${data.name} (${data.roleVisible})`)
            created++
        } else {
            console.log(`⚠️  Ya existe: ${data.name}`)
        }
    }

    console.log(`\nTotal creados: ${created} de ${staffData.length}`)
    await mongoose.disconnect()
}

seedStaff().catch(console.error)
