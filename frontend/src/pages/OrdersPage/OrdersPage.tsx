import React, { useState, useEffect } from 'react';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import OrderCard from '../../components/orders/OrderCard';
import { AdDetailsModal } from '../../components/orders/AdDetailsModal';
import { apiFetch } from '../../api';
import type { Order } from '../../types/orderTypes';
import '../../sass/blocks/orders-page/orders-page.scss';

export const OrdersPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<{
    id: string;
    productName?: string;
    adTitle?: string;
    productDescription?: string;
    adContent?: string;
    productPrice?: number;
    adCost?: number;
    ageOfTargetAudience?: string;
    linkToProduct?: string;
    status?: number;
    postStatus?: number;
  } | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface AdToPostData {
    id: string;
    adTitle?: string;
    adContent?: string;
    adCost?: number;
    postStatus?: number;
  }

  const loadOrders = async () => {
    try {
      // Загружаем только для каналов (принятые рекламы в очереди)
      const ads = await apiFetch<AdToPostData[]>('/api/ads/channel/pending');
      const ordersData: Order[] = ads.map((ad) => ({
        id: ad.id,
        name: ad.adTitle || 'Без названия',
        description: ad.adContent || '',
        status: ad.postStatus === 0 ? 'создан' : ad.postStatus === 1 ? 'ожидает' : 'завершён',
        fullData: ad,
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    if (order.fullData) {
      setSelectedAd(order.fullData);
      setIsAdModalOpen(true);
    }
  };

  const filteredOrders = orders.filter((order) =>
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
      <AdDetailsModal
        isOpen={isAdModalOpen}
        onClose={() => {
          setIsAdModalOpen(false);
          setSelectedAd(null);
        }}
        ad={selectedAd ? {
          id: selectedAd.id,
          productName: selectedAd.productName || selectedAd.adTitle || 'Без названия',
          productDescription: selectedAd.productDescription || selectedAd.adContent || '',
          productPrice: selectedAd.productPrice || 0,
          adCost: selectedAd.adCost || 0,
          ageOfTargetAudience: selectedAd.ageOfTargetAudience,
          linkToProduct: selectedAd.linkToProduct,
          status: selectedAd.status !== undefined ? String(selectedAd.status) : String(selectedAd.postStatus),
          adTitle: selectedAd.adTitle,
          adContent: selectedAd.adContent,
        } : null}
      />
      
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
        {loading ? (
          <div className="orders-page__loading">Загрузка...</div>
        ) : filteredOrders.length > 0 ? (
          <div className="orders-page__orders order-list">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onClick={() => handleOrderClick(order)} />
            ))}
          </div>
        ) : (
          <div className="orders-page__empty">Заказов пока нет</div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;