"use client"

import { useState } from "react"
import { validateField } from "../utils/validation"

export function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name] && validationRules[name]) {
      const error = validateField(name, value, validationRules[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))

    if (validationRules[name]) {
      const error = validateField(name, values[name], validationRules[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validateAll = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name], validationRules[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    return isValid
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
  }
}
