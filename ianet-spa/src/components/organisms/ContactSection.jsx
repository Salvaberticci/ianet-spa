"use client"

import { useState } from "react"
import { Card } from "../atoms/Card"
import { Input } from "../atoms/Input"
import { Textarea } from "../atoms/Textarea"
import { Button } from "../atoms/Button"
import { Toast } from "../atoms/Toast"
import { useForm } from "../../hooks/useForm"
import { contactService } from "../../services/contactService"

const validationRules = {
  name: [{ type: "required", message: "El nombre es requerido" }],
  email: [
    { type: "required", message: "El email es requerido" },
    { type: "email", message: "Email inválido" },
  ],
  phone: [{ type: "phone", message: "Teléfono inválido (8-20 caracteres, puede incluir +, -, espacios)" }],
  subject: [{ type: "required", message: "El asunto es requerido" }],
  message: [
    { type: "required", message: "El mensaje es requerido" },
    { type: "minLength", value: 10, message: "El mensaje debe tener al menos 10 caracteres" },
  ],
}

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const { values, errors, touched, handleChange, handleBlur, validateAll, reset } = useForm(
    {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationRules,
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    setIsSubmitting(true)

    try {
      await contactService.send(values)
      setToast({ type: "success", message: "Mensaje enviado exitosamente. Nos pondremos en contacto pronto." })
      reset()
    } catch (error) {
      setToast({ type: "error", message: error.message || "Error al enviar el mensaje. Intenta nuevamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 text-balance">Contacto</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            ¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <h3 className="text-xl font-bold text-green-700 mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : null}
                placeholder="Tu nombre completo"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : null}
                placeholder="tu@email.com"
                required
              />

              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : null}
                placeholder="+58-XXX-XXXXXXX"
              />

              <Input
                label="Asunto"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subject ? errors.subject : null}
                placeholder="¿Sobre qué quieres hablar?"
                required
              />

              <Textarea
                label="Mensaje"
                name="message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message ? errors.message : null}
                placeholder="Escribe tu mensaje aquí..."
                rows={5}
                required
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </Card>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-green-700 mb-6">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Dirección</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Calle 8, Valera 3101, Trujillo, Venezuela</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">contacto@ianet.gob.ve</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Horario</h4>
                    <p className="text-gray-600 text-sm">Lunes a Viernes: 8:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Maps Embed */}
            <Card className="p-0 overflow-hidden h-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1054.1662250338568!2d-70.59782213396718!3d9.31856484009314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e63290c51133c39%3A0x1e9bb5e83f22df8c!2sIANET%20-%20Instituto%20de%20Alimentaci%C3%B3n%20y%20Nutrici%C3%B3n%20del%20Estado%20Trujillo!5e0!3m2!1sen!2sus!4v1759483792947!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de IANET"
              ></iframe>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  )
}
