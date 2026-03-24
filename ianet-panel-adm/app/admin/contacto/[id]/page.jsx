import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Contact from "@/models/Contact"
import { notFound } from "next/navigation"
import ContactDetail from "@/components/contact-detail"

async function getContact(id) {
  await dbConnect()
  const contact = await Contact.findById(id).lean()
  if (!contact) return null
  return JSON.parse(JSON.stringify(contact))
}

export default async function ContactDetailPage({ params }) {
  await requireAuth()
  const resolvedParams = await params
  const contact = await getContact(resolvedParams.id)

  if (!contact) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detalle del Mensaje</h1>
      <ContactDetail contact={contact} />
    </div>
  )
}
