export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  phone: (value) => {
    const phoneRegex = /^[\d+\-\s()]{8,20}$/
    return phoneRegex.test(value)
  },

  required: (value) => {
    return value && value.trim().length > 0
  },

  minLength: (value, min) => {
    return value && value.trim().length >= min
  },

  appointmentType: (value) => {
    return ["medica", "nutricional"].includes(value)
  },
}

export const validateField = (name, value, rules) => {
  for (const rule of rules) {
    if (rule.type === "required" && !validators.required(value)) {
      return rule.message || "Este campo es requerido"
    }

    if (rule.type === "email" && value && !validators.email(value)) {
      return rule.message || "Email inválido"
    }

    if (rule.type === "phone" && value && !validators.phone(value)) {
      return rule.message || "Teléfono inválido"
    }

    if (rule.type === "minLength" && value && !validators.minLength(value, rule.value)) {
      return rule.message || `Mínimo ${rule.value} caracteres`
    }

    if (rule.type === "appointmentType" && value && !validators.appointmentType(value)) {
      return rule.message || "Tipo de cita inválido"
    }
  }

  return null
}
