import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Menu.scss';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'menu-overlay--open' : ''}`} onClick={onClose} />
      <div className={`menu ${isOpen ? 'menu--open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="menu__close"
          onClick={onClose}
          aria-label="Закрыть меню"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L15 15M15 0L0 15"
              stroke="#CACACA"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <nav className="menu__nav">
          <button
            type="button"
            className={`menu__item ${isActive('/home') ? 'menu__item--active' : ''}`}
            onClick={() => handleNavigation('/home')}
          >
            Главная
          </button>
          <button
            type="button"
            className={`menu__item ${isActive('/orders') ? 'menu__item--active' : ''}`}
            onClick={() => handleNavigation('/orders')}
          >
            Мои заказы
          </button>
          <button
            type="button"
            className={`menu__item ${isActive('/account') ? 'menu__item--active' : ''}`}
            onClick={() => handleNavigation('/account')}
          >
            Мои рекламы
          </button>
          <button
            type="button"
            className={`menu__item ${isActive('/wallet') ? 'menu__item--active' : ''}`}
            onClick={() => handleNavigation('/wallet')}
          >
            Кошелек
          </button>
          <button
            type="button"
            className={`menu__item ${isActive('/support') ? 'menu__item--active' : ''}`}
            onClick={() => handleNavigation('/support')}
          >
            Поддержка
          </button>
        </nav>
      </div>
    </>
  );
};

