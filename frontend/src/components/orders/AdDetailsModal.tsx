import React from 'react';
import './AdDetailsModal.scss';

interface AdDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: {
    id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    adCost: number;
    ageOfTargetAudience?: string;
    linkToProduct?: string;
    status?: string;
    adTitle?: string;
    adContent?: string;
  } | null;
}

export const AdDetailsModal: React.FC<AdDetailsModalProps> = ({ isOpen, onClose, ad }) => {
  if (!isOpen || !ad) return null;

  return (
    <>
      <div className="ad-details-modal-overlay" onClick={onClose} />
      <div className="ad-details-modal">
        <button
          type="button"
          className="ad-details-modal__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        
        <div className="ad-details-modal__header">
          <h2 className="ad-details-modal__title">{ad.productName}</h2>
          {ad.status && (
            <span className={`ad-details-modal__status status-${ad.status}`}>
              {ad.status}
            </span>
          )}
        </div>

        <div className="ad-details-modal__content">
          <div className="ad-details-modal__section">
            <h3 className="ad-details-modal__section-title">Описание продукта</h3>
            <p className="ad-details-modal__text">{ad.productDescription}</p>
          </div>

          <div className="ad-details-modal__section">
            <h3 className="ad-details-modal__section-title">Цена продукта</h3>
            <p className="ad-details-modal__text">{ad.productPrice.toFixed(2)} руб.</p>
          </div>

          <div className="ad-details-modal__section">
            <h3 className="ad-details-modal__section-title">Стоимость рекламы</h3>
            <p className="ad-details-modal__text">{ad.adCost.toFixed(2)} руб.</p>
          </div>

          {ad.ageOfTargetAudience && (
            <div className="ad-details-modal__section">
              <h3 className="ad-details-modal__section-title">Возраст целевой аудитории</h3>
              <p className="ad-details-modal__text">{ad.ageOfTargetAudience}</p>
            </div>
          )}

          {ad.linkToProduct && (
            <div className="ad-details-modal__section">
              <h3 className="ad-details-modal__section-title">Ссылка на продукт</h3>
              <a 
                href={ad.linkToProduct} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ad-details-modal__link"
              >
                {ad.linkToProduct}
              </a>
            </div>
          )}

          {ad.adTitle && (
            <div className="ad-details-modal__section">
              <h3 className="ad-details-modal__section-title">Заголовок поста</h3>
              <p className="ad-details-modal__text">{ad.adTitle}</p>
            </div>
          )}

          {ad.adContent && (
            <div className="ad-details-modal__section">
              <h3 className="ad-details-modal__section-title">Текст поста</h3>
              <p className="ad-details-modal__text">{ad.adContent}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

