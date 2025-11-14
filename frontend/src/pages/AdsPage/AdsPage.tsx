import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import OrderCard from '../../components/orders/OrderCard';
import type { Order } from '../../types/orderTypes';
import { Notification } from '../../components/Notification';
import '../../sass/blocks/ads-page/ads-page.scss';

const mockAds: Order[] = [
  {
    id: '1',
    name: 'Картина с изображением моря',
    description: 'Не просто картина, а то чувство, когда просыпаешься и выходишь на веранду маленького домика в Италии.',
    status: 'создан',
  },
  {
    id: '2',
    name: 'Подсвечник-загагулина',
    description: 'То, что может украсить любой интерьер и дополнить атмосферу, созданную свечами.',
    status: 'ожидает',
  },
  {
    id: '3',
    name: '3D картина из глины',
    description: 'Не цветовой акцент, а текстурное чудо в вашем доме. Это картина, сделанная руками из глины.',
    status: 'отклонён',
  },
  {
    id: '4',
    name: 'Постеры с картинами Климта',
    description: 'Лучшие постеры с самыми известными картинами Климта, напечатанные на плотном матовом гобелене.',
    status: 'завершён',
  },
];

export const AdsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Проверяем, нужно ли показать уведомление
    const shouldShowNotification = localStorage.getItem('showAdCreatedNotification');
    if (shouldShowNotification === 'true') {
      setShowNotification(true);
      localStorage.removeItem('showAdCreatedNotification');
    }
  }, []);

  const filteredAds = mockAds.filter((ad) =>
    ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ads-page">
      {showNotification && (
        <Notification
          message="Реклама успешно добавлена и отправлена на модерацию"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
      <Header
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        variant="red"
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div className="ads-page__search">
        <div className="ads-page__search-bar">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ads-page__search-icon"
          >
            <circle cx="7" cy="7" r="5" stroke="#6B6B6B" strokeWidth="1" />
            <path d="M11 11L14 14" stroke="#6B6B6B" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="ads-page__search-input"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="ads-page__sort"
          aria-label="Сортировка"
        >
          <svg
            width="8"
            height="18"
            viewBox="0 0 8 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L0 17M8 0L8 18"
              stroke="#6B6B6B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      
      <div className="ads-page__content">
        <button
          type="button"
          className="ads-page__create-button"
          onClick={() => navigate('/create-ad')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ads-page__create-icon"
          >
            <path
              d="M10 4V16M4 10H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="ads-page__create-text">Создать</span>
        </button>
        
        <div className="ads-page__ads order-list">
          {filteredAds.map((ad) => (
            <OrderCard key={ad.id} order={ad} />
          ))}
        </div>
      </div>
    </div>
  );
};

