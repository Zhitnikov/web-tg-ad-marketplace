import React from 'react';
import './ProfileModal.scss';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`profile-modal-overlay ${isOpen ? 'profile-modal-overlay--open' : ''}`} onClick={onClose} />
      {isOpen && (
        <div className="profile-modal profile-modal--open">
          <button
            type="button"
            className="profile-modal__close"
            onClick={onClose}
            aria-label="Закрыть профиль"
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
          
          <div className="profile-modal__header">
            <h2 className="profile-modal__title">Название канала</h2>
            <p className="profile-modal__name">Иванов Иван Иванович</p>
            <p className="profile-modal__phone">000000000000</p>
          </div>

          <div className="profile-modal__section">
            <div className="profile-modal__divider" />
            <div className="profile-modal__field">
              <label className="profile-modal__label">Город</label>
              <p className="profile-modal__value">Москва</p>
            </div>
          </div>

          <div className="profile-modal__section">
            <div className="profile-modal__divider" />
            <div className="profile-modal__field">
              <label className="profile-modal__label">Тема канала</label>
              <p className="profile-modal__value">Искусство и культура</p>
            </div>
          </div>

          <div className="profile-modal__section">
            <div className="profile-modal__divider" />
            <div className="profile-modal__field">
              <label className="profile-modal__label">Ссылка на канал</label>
              <p className="profile-modal__value">https://t.me/randomart</p>
            </div>
          </div>

          <div className="profile-modal__section">
            <div className="profile-modal__divider" />
            <div className="profile-modal__field">
              <label className="profile-modal__label">Описание канала</label>
              <p className="profile-modal__value">Телеграм-канал с интересными фактами об искусстве</p>
            </div>
          </div>

          <div className="profile-modal__section">
            <div className="profile-modal__divider" />
            <div className="profile-modal__field">
              <label className="profile-modal__label">Email</label>
              <p className="profile-modal__value">Ivanov.company@gmail.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

