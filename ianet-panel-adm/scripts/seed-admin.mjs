import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, "../.env.local") })

async function seedAdmin() {
  const { default: dbConnect } = await import("../lib/mongodb.js")
  const { default: User } = await import("../models/User.js")
  const bcrypt = (await import("bcryptjs")).default

  await dbConnect()

  const adminEmail = "admin@ianet.gob.ve"

  const existingAdmin = await User.findOne({ email: adminEmail })

  if (existingAdmin) {
    console.log("El usuario admin ya existe")
    return
  }

  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await User.create({
    name: "Administrador IANET",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    active: true,
  })

  console.log("Usuario admin creado exitosamente")
  console.log("Email:", adminEmail)
  console.log("Password: admin123")
  console.log("IMPORTANTE: Cambia esta contraseña después del primer login")
}

seedAdmin()
