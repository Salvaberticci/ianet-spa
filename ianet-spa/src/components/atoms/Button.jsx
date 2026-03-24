"use client"

export function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const baseStyles =
    "rounded-3xl px-5 py-2 shadow-md focus:outline-none focus:ring-2 transition-colors duration-200 font-medium"

  const variants = {
    primary:
      "bg-green-700 hover:bg-green-800 text-white focus:ring-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary:
      "bg-white hover:bg-gray-50 text-green-700 border-2 border-green-700 focus:ring-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed",
    ghost: "bg-transparent hover:bg-green-50 text-green-700 focus:ring-green-600",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
