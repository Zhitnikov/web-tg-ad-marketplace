import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import OrderCard from '../../components/orders/OrderCard';
import type { Order } from '../../types/orderTypes';
import { Notification } from '../../components/Notification';
import { AdDetailsModal } from '../../components/orders/AdDetailsModal';
import '../../sass/blocks/ads-page/ads-page.scss';
import { apiFetch } from '../../api';

export const AdsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [ads, setAds] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState<{
    id: string;
    productName?: string;
    productDescription?: string;
    productPrice?: number;
    adCost?: number;
    ageOfTargetAudience?: string;
    linkToProduct?: string;
    status?: number;
  } | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  interface CampaignData {
    id: string;
    productName?: string;
    productDescription?: string;
    productPrice?: number;
    adCost?: number;
    ageOfTargetAudience?: string;
    linkToProduct?: string;
    status?: number;
  }

  useEffect(() => {
    // Проверяем, нужно ли показать уведомление
    const shouldShowNotification = localStorage.getItem('showAdCreatedNotification');
    if (shouldShowNotification === 'true') {
      setShowNotification(true);
      localStorage.removeItem('showAdCreatedNotification');
    }
  }, []);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<CampaignData[]>('/api/ads/company/my');

      const normalized: Order[] = data.map((item) => ({
        id: item.id,
        name: item.productName ?? 'Рекламная кампания',
        description: item.productDescription ?? '',
        status: item.status === 0 ? 'создан' : item.status === 1 ? 'ожидает' : item.status === 2 ? 'опубликован' : 'неизвестно',
        fullData: item,
      }));

      setAds(normalized);
    } catch (error) {
      console.error('Не удалось загрузить рекламу компании', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleAdClick = (ad: Order) => {
    if (ad.fullData) {
      setSelectedAd(ad.fullData);
      setIsAdModalOpen(true);
    }
  };

  const handleEdit = (ad: Order) => {
    if (ad.fullData) {
      navigate(`/create-ad?edit=${ad.id}`);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      await apiFetch(`/api/ads/company/${adId}`, {
        method: 'DELETE',
      });
      await fetchAds();
    } catch (error) {
      console.error('Ошибка удаления рекламы:', error);
      alert('Ошибка при удалении рекламы');
    }
  };

  const handlePublish = async (adId: string) => {
    try {
      await apiFetch(`/api/ads/company/${adId}/publish`, {
        method: 'POST',
      });
      await fetchAds();
    } catch (error) {
      console.error('Ошибка публикации рекламы:', error);
      alert('Ошибка при публикации рекламы');
    }
  };

  const handleContact = (ad: Order) => {
    navigate('/accepted-ads');
  };

  const filteredAds = ads.filter((ad) =>
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
      <AdDetailsModal
        isOpen={isAdModalOpen}
        onClose={() => {
          setIsAdModalOpen(false);
          setSelectedAd(null);
        }}
        ad={selectedAd ? {
          id: selectedAd.id,
          productName: selectedAd.productName || 'Без названия',
          productDescription: selectedAd.productDescription || '',
          productPrice: selectedAd.productPrice || 0,
          adCost: selectedAd.adCost || 0,
          ageOfTargetAudience: selectedAd.ageOfTargetAudience,
          linkToProduct: selectedAd.linkToProduct,
          status: String(selectedAd.status),
        } : null}
      />
      
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
        
        {isLoading ? (
          <div className="ads-page__loading">Загрузка...</div>
        ) : filteredAds.length > 0 ? (
          <div className="ads-page__ads order-list">
            {filteredAds.map((ad) => (
              <OrderCard 
                key={ad.id} 
                order={ad} 
                onClick={() => handleAdClick(ad)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={handlePublish}
                onContact={handleContact}
                showPublish={true}
              />
            ))}
          </div>
        ) : (
          <div className="ads-page__empty">Рекламы пока нет</div>
        )}
      </div>
    </div>
  );
};

