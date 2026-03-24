import { Card } from "../atoms/Card"

const aboutItems = [
  {
    title: "Misión",
    description:
      "Garantizar la ejecución de las políticas alimentarias y nutricionales para proporcionarle a la población la disponibilidad, el acceso oportuno y la equitativa distribución de los alimentos basada en los principios de seguridad alimentaria y justicia social, con especial atención a la población más vulnerable comprometidos con la nueva estructura social y el modelo productivo del país.",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    title: "Visión",
    description:
      "Ser una institución modelo de referencia nacional en materia de alimentación y nutrición, diseñada en el marco del nuevo modelo socialista, apegada en los principios constitucionales de eficiencia, eficacia, celeridad y legalidad con conciencia del deber social y compromiso organizacional.",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
          fillRule="evenodd"
          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Naturaleza",
    description:
      "Institución pública dedicada a la labor social en el área de nutrición, bajo el sistema de protección social nutricional. Ente adscrito a la Gobernación Bolivariana del Estado Trujillo.",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Historia",
    description:
      "Fundado con el propósito de atender las necesidades nutricionales del Estado Trujillo, IANET ha sido pilar fundamental en la promoción de la salud alimentaria desde su creación.",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Organigrama",
    description:
      "Nuestra estructura organizacional está diseñada para brindar atención eficiente y coordinada, con departamentos especializados en nutrición, medicina y programas comunitarios.",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
]

export function QuienesSomosSection() {
  return (
    <section id="quienes-somos" className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 text-balance">Quiénes Somos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Somos una institución comprometida con la promoción de la salud nutricional en el Estado Trujillo, trabajando para mejorar la calidad de vida de nuestra comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-700">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-green-700">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
