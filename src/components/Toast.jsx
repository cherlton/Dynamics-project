import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function Toast({ message, type = 'success', duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const styles = {
    success: 'bg-white border border-green-200',
    error: 'bg-white border border-red-200',
    info: 'bg-white border border-blue-200',
  }

  return (
    <div
      className={`toast ${styles[type]} flex items-center gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {icons[type]}
      <span className="text-gray-800">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-2 text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
