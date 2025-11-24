import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import '../styles/Toast.css';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" />;
      case 'error':
        return <AlertCircle className="toast-icon" />;
      case 'info':
        return <Info className="toast-icon" />;
      default:
        return <CheckCircle className="toast-icon" />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={() => onClose(id)}>
        <X className="icon" />
      </button>
    </div>
  );
}
