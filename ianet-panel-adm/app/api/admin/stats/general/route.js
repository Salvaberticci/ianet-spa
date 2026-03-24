import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Event from "@/models/Event"
import Inventory from "@/models/Inventory"
import Contact from "@/models/Contact"
import NutritionalData from "@/models/NutritionalData"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const [
      totalAppointments,
      medicalAppointments,
      nutritionalAppointments,
      totalEvents,
      totalInventory,
      activeInventory,
      totalContacts,
      newContacts,
      uniquePatients,
      totalNutritionalRecords,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ type: "medica" }),
      Appointment.countDocuments({ type: "nutricional" }),
      Event.countDocuments(),
      Inventory.countDocuments(),
      Inventory.countDocuments({ status: "activo" }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: "nuevo" }),
      Appointment.distinct("patientEmail").then((emails) => emails.length),
      NutritionalData.countDocuments(),
    ])

    return NextResponse.json({
      appointments: {
        total: totalAppointments,
        medical: medicalAppointments,
        nutritional: nutritionalAppointments,
      },
      events: {
        total: totalEvents,
      },
      inventory: {
        total: totalInventory,
        active: activeInventory,
      },
      contacts: {
        total: totalContacts,
        new: newContacts,
      },
      patients: {
        unique: uniquePatients,
      },
      nutritional: {
        totalRecords: totalNutritionalRecords,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

