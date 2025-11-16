import React, { useState, useEffect } from 'react';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import { apiFetch } from '../../api';
import './AcceptedAdsPage.scss';

interface AcceptedAd {
  id: string;
  companyAdId: string;
  adTitle?: string;
  adContent?: string;
  adCost?: number;
  channelId?: string;
  channelName?: string;
  channelLink?: string;
  postStatus?: number;
}

export const AcceptedAdsPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [ads, setAds] = useState<AcceptedAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAcceptedAds();
  }, []);

  const loadAcceptedAds = async () => {
    try {
      const data = await apiFetch<AcceptedAd[]>('/api/ads/company/accepted');
      setAds(data);
    } catch (error) {
      console.error('Ошибка загрузки принятых реклам:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (ad: AcceptedAd) => {
    if (ad.channelLink) {
      window.open(ad.channelLink, '_blank');
    } else if (ad.channelName) {
      alert(`Канал: ${ad.channelName}\n\nСсылка на канал не указана.`);
    } else {
      alert('Информация о канале недоступна.');
    }
  };

  return (
    <div className="accepted-ads-page">
      <Header
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        variant="red"
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <div className="accepted-ads-page__content">
        <h1 className="accepted-ads-page__title">Принятые рекламы</h1>

        {loading ? (
          <div className="accepted-ads-page__loading">Загрузка...</div>
        ) : ads.length > 0 ? (
          <div className="accepted-ads-page__ads">
            {ads.map((ad) => (
              <div key={ad.id} className="accepted-ads-page__ad-card">
                <div className="accepted-ads-page__ad-header">
                  <h3 className="accepted-ads-page__ad-title">{ad.adTitle || 'Без названия'}</h3>
                  <span className="accepted-ads-page__ad-status">Ожидает</span>
                </div>
                <p className="accepted-ads-page__ad-description">{ad.adContent || ''}</p>
                <div className="accepted-ads-page__ad-footer">
                  <div className="accepted-ads-page__ad-info">
                    <span className="accepted-ads-page__ad-cost">{ad.adCost?.toFixed(2) || '0.00'} руб.</span>
                    {ad.channelName && (
                      <span className="accepted-ads-page__ad-channel">Канал: {ad.channelName}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="accepted-ads-page__contact-button"
                    onClick={() => handleContact(ad)}
                  >
                    {ad.channelLink ? 'Перейти к каналу' : 'Связаться с каналом'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="accepted-ads-page__empty">Принятых реклам пока нет</div>
        )}
      </div>
    </div>
  );
};

