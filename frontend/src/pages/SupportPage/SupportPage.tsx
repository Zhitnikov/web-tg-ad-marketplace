import React, { useState } from 'react';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import '../../sass/blocks/support-page/support-page.scss';

export const SupportPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="support-page">
      <Header
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        variant="red"
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div className="support-page__content">
        <div className="support-page__header">
          <h1 className="support-page__title">Поддержка</h1>
          <p className="support-page__subtitle">
            Если у вас возникли проблемы, сообщите нам
          </p>
        </div>

        <div className="support-page__contacts">
          <div className="support-page__contact-item">
            <p className="support-page__contact-label">Телефон</p>
            <a href="tel:+79610000000" className="support-page__contact-value">
              +7 (961) 000-00-00
            </a>
          </div>
          <div className="support-page__divider"></div>
          <div className="support-page__contact-item">
            <p className="support-page__contact-label">Email</p>
            <a href="mailto:Ivanov.company@gmail.com" className="support-page__contact-value">
              Ivanov.company@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

