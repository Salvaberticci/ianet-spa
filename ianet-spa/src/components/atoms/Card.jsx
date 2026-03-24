export function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-white rounded-3xl border border-green-100 shadow-sm p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}
