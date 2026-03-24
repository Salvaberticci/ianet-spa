import { Card } from "../atoms/Card"
import { Button } from "../atoms/Button"

const services = [
  {
    title: "Consultas Nutricionales",
    description:
      "Evaluación y seguimiento nutricional personalizado con profesionales especializados para mejorar tu salud y bienestar.",
    image: "/jornada4.jpeg",
  },
  {
    title: "Atención Médica",
    description:
      "Servicios médicos integrales enfocados en la prevención y tratamiento de condiciones relacionadas con la alimentación.",
    image: "/jornada-medica2.jpeg",
  },
  {
    title: "Programas Comunitarios",
    description:
      "Iniciativas educativas y de prevención para promover hábitos alimenticios saludables en toda la comunidad.",
    image: "/jornada5.jpeg",
  },
]

export function ServiciosSection() {
  return (
    <section id="servicios" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 text-balance">Nuestros Servicios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Ofrecemos una amplia gama de servicios diseñados para cuidar tu salud y la de tu familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg?height=300&width=400"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-700 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">{service.description}</p>
                <Button variant="secondary" className="w-full">
                  Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
