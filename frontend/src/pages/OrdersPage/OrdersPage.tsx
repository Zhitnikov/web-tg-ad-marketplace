import React, { useState } from 'react';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import OrderCard from '../../components/orders/OrderCard';
import type { Order } from '../../types/orderTypes';
import '../../sass/blocks/orders-page/orders-page.scss';

const mockOrders: Order[] = [
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
    status: 'завершён',
  },
  {
    id: '4',
    name: 'Постеры с картинами Климта',
    description: 'Лучшие постеры с самыми известными картинами Климта, напечатанные на плотном матовом гобелене.',
    status: 'отклонён',
  },
];

export const OrdersPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = mockOrders.filter((order) =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orders-page">
      <Header
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        variant="red"
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div className="orders-page__search">
        <div className="orders-page__search-bar">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="orders-page__search-icon"
          >
            <circle cx="7" cy="7" r="5" stroke="#6B6B6B" strokeWidth="1" />
            <path d="M11 11L14 14" stroke="#6B6B6B" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="orders-page__search-input"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="orders-page__sort"
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
      
      <div className="orders-page__content">
        <div className="orders-page__orders order-list">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

