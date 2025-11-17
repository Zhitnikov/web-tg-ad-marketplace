import React, { useEffect, useState } from 'react';
import './Notification.scss';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Ждем завершения анимации
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`notification notification--${type} ${isVisible ? 'notification--visible' : ''}`}
    >
      <div className="notification__content">
        <span className="notification__message">{message}</span>
        <button
          type="button"
          className="notification__close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
    </div>
  );
};

