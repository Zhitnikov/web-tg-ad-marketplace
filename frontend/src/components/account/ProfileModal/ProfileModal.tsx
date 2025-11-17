import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../api';
import './ProfileModal.scss';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone: string;
  role: string;
  balance: number;
  company?: {
    id: string;
    companyName: string;
    description?: string;
  };
  channel?: {
    id: string;
    channelName: string;
    channelLink: string;
    city?: string;
    channelTheme?: string;
    channelDescription?: string;
    membersAge?: string;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ProfileData>('/api/user/profile');
      setProfile(data);
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`profile-modal-overlay ${isOpen ? 'profile-modal-overlay--open' : ''}`} onClick={onClose} />
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
        
        {loading ? (
          <div className="profile-modal__loading">Загрузка...</div>
        ) : profile ? (
          <>
            <div className="profile-modal__header">
              <h2 className="profile-modal__title">
                {profile.channel?.channelName || profile.company?.companyName || 'Профиль'}
              </h2>
              <p className="profile-modal__name">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="profile-modal__phone">{profile.telephone}</p>
            </div>

            {profile.channel && (
              <>
                {profile.channel.city && (
                  <div className="profile-modal__section">
                    <div className="profile-modal__divider" />
                    <div className="profile-modal__field">
                      <label className="profile-modal__label">Город</label>
                      <p className="profile-modal__value">{profile.channel.city}</p>
                    </div>
                  </div>
                )}

                {profile.channel.channelTheme && (
                  <div className="profile-modal__section">
                    <div className="profile-modal__divider" />
                    <div className="profile-modal__field">
                      <label className="profile-modal__label">Тема канала</label>
                      <p className="profile-modal__value">{profile.channel.channelTheme}</p>
                    </div>
                  </div>
                )}

                {profile.channel.channelLink && (
                  <div className="profile-modal__section">
                    <div className="profile-modal__divider" />
                    <div className="profile-modal__field">
                      <label className="profile-modal__label">Ссылка на канал</label>
                      <p className="profile-modal__value">{profile.channel.channelLink}</p>
                    </div>
                  </div>
                )}

                {profile.channel.channelDescription && (
                  <div className="profile-modal__section">
                    <div className="profile-modal__divider" />
                    <div className="profile-modal__field">
                      <label className="profile-modal__label">Описание канала</label>
                      <p className="profile-modal__value">{profile.channel.channelDescription}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {profile.company && profile.company.description && (
              <div className="profile-modal__section">
                <div className="profile-modal__divider" />
                <div className="profile-modal__field">
                  <label className="profile-modal__label">Описание компании</label>
                  <p className="profile-modal__value">{profile.company.description}</p>
                </div>
              </div>
            )}

            <div className="profile-modal__section">
              <div className="profile-modal__divider" />
              <div className="profile-modal__field">
                <label className="profile-modal__label">Email</label>
                <p className="profile-modal__value">{profile.email}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="profile-modal__error">Не удалось загрузить профиль</div>
        )}
      </div>
    </>
  );
};

