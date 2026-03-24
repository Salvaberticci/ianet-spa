import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, "../.env.local") })

// ── helpers ──────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randFloat = (min, max, dec = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(dec))

const MONTHS_BACK = 12

// Date helpers
function daysAgo(n) {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return d
}

function dateInMonth(yearOffset, monthIndex, day, hour = 9) {
    const now = new Date()
    const d = new Date(now.getFullYear(), now.getMonth() - yearOffset + monthIndex, day, hour, 0, 0)
    return d
}

// ── patient pool ──────────────────────────────────────────────────────────────
const PATIENTS = [
    { name: "María Rodríguez", email: "m.rodriguez@gmail.com", phone: "+58-412-1001001" },
    { name: "Carlos García", email: "c.garcia@gmail.com", phone: "+58-414-2002002" },
    { name: "Ana Martínez", email: "a.martinez@yahoo.com", phone: "+58-416-3003003" },
    { name: "Luis Pérez", email: "l.perez@outlook.com", phone: "+58-424-4004004" },
    { name: "Sofía López", email: "s.lopez@gmail.com", phone: "+58-412-5005005" },
    { name: "José Hernández", email: "j.hernandez@hotmail.com", phone: "+58-414-6006006" },
    { name: "Carmen Torres", email: "c.torres@gmail.com", phone: "+58-416-7007007" },
    { name: "Pedro Ramírez", email: "p.ramirez@yahoo.com", phone: "+58-424-8008008" },
    { name: "Laura Jiménez", email: "l.jimenez@gmail.com", phone: "+58-412-9009009" },
    { name: "Miguel González", email: "m.gonzalez@gmail.com", phone: "+58-414-1010101" },
]

const EVENT_NAMES = [
    "Jornada de Control Nutricional",
    "Charla sobre Alimentación Saludable",
    "Taller de Primeros Auxilios",
    "Campaña de Vacunación",
    "Feria de la Salud",
    "Seminario de Medicina Preventiva",
    "Jornada de Control de Peso",
    "Taller de Lactancia Materna",
    "Control Pediátrico Comunitario",
    "Día de la Salud IANET",
]

const STATUSES = ["solicitada", "confirmada", "atendida", "cancelada"]
const STATUS_WEIGHTS = [0.1, 0.2, 0.6, 0.1] // mostly atendida for past data

function weightedStatus() {
    const r = Math.random()
    let acc = 0
    for (let i = 0; i < STATUSES.length; i++) {
        acc += STATUS_WEIGHTS[i]
        if (r <= acc) return STATUSES[i]
    }
    return "confirmada"
}

async function main() {
    const { default: mongoose } = await import("mongoose")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB\n")

    // ── Define schemas inline ──────────────────────────────────────────────────
    const AppointmentSchema = new mongoose.Schema({
        patientName: String, patientEmail: String, patientPhone: String,
        type: String, dateTime: Date, status: String, notes: String,
        assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    }, { timestamps: true })

    const EventSchema = new mongoose.Schema({
        name: String, description: String, date: Date,
        time: String, location: String, responsible: String,
    }, { timestamps: true })

    const NutritionalSchema = new mongoose.Schema({
        patientEmail: String, patientName: String, date: Date,
        weight: Number, height: Number, bmi: Number, notes: String,
    }, { timestamps: true })

    const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)
    const Event = mongoose.models.Event || mongoose.model("Event", EventSchema)
    const NutritionalData = mongoose.models.NutritionalData || mongoose.model("NutritionalData", NutritionalSchema)

    // Get staff IDs
    const Staff = mongoose.models.Staff || mongoose.model("Staff", new mongoose.Schema({ name: String }))
    const staffDocs = await Staff.find({}).lean()
    const staffIds = staffDocs.map(s => s._id)

    // ── 1. Appointments (last 12 months) ─────────────────────────────────────
    console.log("📅 Creating appointments...")
    const appointments = []
    const usedSlots = new Set()

    for (let monthsAgo = MONTHS_BACK; monthsAgo >= 0; monthsAgo--) {
        const perMonth = rand(8, 18)
        for (let i = 0; i < perMonth; i++) {
            const patient = pick(PATIENTS)
            const type = Math.random() > 0.45 ? "medica" : "nutricional"
            const day = rand(1, 27)
            const hour = pick([8, 9, 10, 11, 14, 15, 16])

            const now = new Date()
            const dt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day, hour, 0, 0)
            const slotKey = dt.toISOString()

            if (usedSlots.has(slotKey)) continue
            usedSlots.add(slotKey)

            appointments.push({
                patientName: patient.name,
                patientEmail: patient.email,
                patientPhone: patient.phone,
                type,
                dateTime: dt,
                status: monthsAgo > 0 ? weightedStatus() : pick(["solicitada", "confirmada"]),
                notes: "",
                assignedStaff: staffIds.length ? pick(staffIds) : undefined,
            })
        }
    }

    await Appointment.insertMany(appointments)
    console.log(`   ✅ ${appointments.length} citas insertadas`)

    // ── 2. Events (2–4 per month) ─────────────────────────────────────────────
    console.log("🗓  Creating events...")
    const events = []
    for (let monthsAgo = MONTHS_BACK; monthsAgo >= 0; monthsAgo--) {
        const count = rand(2, 4)
        for (let i = 0; i < count; i++) {
            const now = new Date()
            const dt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, rand(1, 27), 8, 0, 0)
            events.push({
                name: pick(EVENT_NAMES),
                description: "Actividad institucional organizada por IANET.",
                date: dt,
                time: `${rand(8, 16)}:00`,
                location: pick(["Sede IANET", "Ambulatorio Norte", "Centro Cívico", "Unidad de Salud Sur"]),
                responsible: pick(["Departamento de Nutrición", "Dirección IANET", "Equipo Médico"]),
            })
        }
    }
    await Event.insertMany(events)
    console.log(`   ✅ ${events.length} eventos insertados`)

    // ── 3. Nutritional data (2–5 per patient per month) ───────────────────────
    console.log("🥗  Creating nutritional records...")
    const nutritional = []
    for (const patient of PATIENTS) {
        // Starting weight
        let weight = randFloat(55, 90)
        const height = randFloat(1.55, 1.85, 2) // metres
        for (let monthsAgo = MONTHS_BACK; monthsAgo >= 0; monthsAgo--) {
            const records = rand(1, 3)
            for (let i = 0; i < records; i++) {
                // Simulate slight weight changes over time
                weight = parseFloat((weight + randFloat(-0.5, 0.5)).toFixed(1))
                const bmi = parseFloat((weight / (height * height)).toFixed(1))
                const now = new Date()
                const dt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, rand(1, 27))
                nutritional.push({
                    patientName: patient.name,
                    patientEmail: patient.email,
                    date: dt,
                    weight,
                    height,
                    bmi,
                    notes: "Registro de seguimiento nutricional.",
                })
            }
        }
    }
    await NutritionalData.insertMany(nutritional)
    console.log(`   ✅ ${nutritional.length} registros nutricionales insertados`)

    console.log("\n🎉 Seeding completo!")
    await mongoose.disconnect()
}

main().catch((err) => { console.error(err); process.exit(1) })
