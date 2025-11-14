import React from 'react';
import './Header.scss';

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  variant?: 'default' | 'red';
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick, variant = 'default' }) => {

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
      </div>
    </header>
  );
};

