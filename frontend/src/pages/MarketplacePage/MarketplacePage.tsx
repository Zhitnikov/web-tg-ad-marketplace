import React, { useState, useEffect } from 'react';
import { Header } from '../../components/account/Header';
import { Menu } from '../../components/account/Menu';
import { ProfileModal } from '../../components/account/ProfileModal';
import { apiFetch } from '../../api';
import { AdDetailsModal } from '../../components/orders/AdDetailsModal';
import './MarketplacePage.scss';

interface AvailableAd {
  id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  adCost: number;
  ageOfTargetAudience?: string;
  linkToProduct?: string;
  imageUrl?: string;
  status: number;
}

export const MarketplacePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [ads, setAds] = useState<AvailableAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AvailableAd | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const data = await apiFetch<AvailableAd[]>('/api/ads/available');
      setAds(data);
    } catch (error) {
      console.error('Ошибка загрузки доступных реклам:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAd = async (adId: string) => {
    try {
      await apiFetch(`/api/ads/accept/${adId}`, {
        method: 'POST',
      });
      alert('Реклама успешно принята!');
      loadAds();
    } catch (error: any) {
      console.error('Ошибка принятия рекламы:', error);
      alert(error.message || 'Ошибка при принятии рекламы');
    }
  };

  const handleAdClick = (ad: AvailableAd) => {
    setSelectedAd(ad);
    setIsAdModalOpen(true);
  };

  return (
    <div className="marketplace-page">
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
          productName: selectedAd.productName,
          productDescription: selectedAd.productDescription,
          productPrice: selectedAd.productPrice,
          adCost: selectedAd.adCost,
          ageOfTargetAudience: selectedAd.ageOfTargetAudience,
          linkToProduct: selectedAd.linkToProduct,
          status: String(selectedAd.status),
        } : null}
      />
      
      <div className="marketplace-page__content">
        <h1 className="marketplace-page__title">Маркетплейс рекламы</h1>
        
        {loading ? (
          <div className="marketplace-page__loading">Загрузка...</div>
        ) : ads.length > 0 ? (
          <div className="marketplace-page__ads">
            {ads.map((ad) => (
              <div key={ad.id} className="marketplace-page__ad-card">
                {ad.imageUrl && (
                  <div className="marketplace-page__ad-image">
                    <img src={ad.imageUrl} alt={ad.productName} />
                  </div>
                )}
                <div className="marketplace-page__ad-header">
                  <h3 className="marketplace-page__ad-title" onClick={() => handleAdClick(ad)}>
                    {ad.productName}
                  </h3>
                  <div className="marketplace-page__ad-cost">{ad.adCost.toFixed(2)} руб.</div>
                </div>
                <p className="marketplace-page__ad-description">{ad.productDescription}</p>
                <div className="marketplace-page__ad-info">
                  {ad.ageOfTargetAudience && (
                    <span className="marketplace-page__ad-tag">Возраст: {ad.ageOfTargetAudience}</span>
                  )}
                  <span className="marketplace-page__ad-tag">Цена: {ad.productPrice.toFixed(2)} руб.</span>
                </div>
                <button
                  type="button"
                  className="marketplace-page__accept-button"
                  onClick={() => handleAcceptAd(ad.id)}
                >
                  Принять рекламу
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="marketplace-page__empty">Доступных реклам пока нет</div>
        )}
      </div>
    </div>
  );
};

