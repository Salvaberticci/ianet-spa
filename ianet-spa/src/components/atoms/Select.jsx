"use client"

export function Select({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  options = [],
  placeholder = "Seleccionar...",
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-green-700 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur && onBlur(name)}
        className={`border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all bg-white ${
          error ? "border-red-500" : "border-green-300"
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}
