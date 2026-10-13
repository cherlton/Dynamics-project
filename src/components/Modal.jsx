export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f1b29]/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white border border-slate-300 shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto animate-fade-in rounded-none`}
        style={{ borderRadius: 0 }}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200 z-10">
          <h2 className="formal-heading-dark text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 transition-colors rounded-none"
            style={{ borderRadius: 0 }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
