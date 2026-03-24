import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Contact from "@/models/Contact"
import ContactTable from "@/components/contact-table"

async function getContacts(rawSearchParams) {
  await dbConnect()

  const searchParams = await rawSearchParams
  const status = searchParams?.status || ""
  const page = Number.parseInt(searchParams?.page || "1")
  const limit = 10

  const query = {}

  if (status) {
    query.status = status
  }

  const skip = (page - 1) * limit

  const [contacts, total] = await Promise.all([
    Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(query),
  ])

  return {
    contacts: JSON.parse(JSON.stringify(contacts)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function ContactoPage({ searchParams }) {
  await requireAuth()
  const resolvedSearchParams = await searchParams
  const { contacts, pagination } = await getContacts(Promise.resolve(resolvedSearchParams))

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mensajes de Contacto</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ContactTable contacts={contacts} pagination={pagination} />
      </div>
    </div>
  )
}
