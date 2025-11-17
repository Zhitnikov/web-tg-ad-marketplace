import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../../../api';
import './Header.scss';

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  variant?: 'default' | 'red';
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick, variant = 'default', showLogout = true }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/auth', { replace: true });
  };

  return (
    <header className={`account-header ${variant === 'red' ? 'account-header--red' : ''}`}>
      <div className="account-header__icons">
        <button
          type="button"
          className="account-header__icon"
          onClick={onProfileClick}
          aria-label="Открыть профиль"
        >
          <svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="9.5" cy="6.5" r="3.5" fill="#FFFFFF" />
            <path
              d="M2 17C2 13.6863 4.68629 11 8 11H11C14.3137 11 17 13.6863 17 17"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="account-header__icon"
          onClick={onMenuClick}
          aria-label="Открыть меню"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0H15M0 7.5H15M0 15H15"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {showLogout && (
          <button
            type="button"
            className="account-header__icon"
            onClick={handleLogout}
            aria-label="Выйти"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 2H3C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H7M12 13L16 9M16 9L12 5M16 9H7"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

