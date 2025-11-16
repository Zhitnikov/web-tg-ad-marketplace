import React, { useState, useEffect } from 'react';
import OrderList from '../components/orders/OrderList';
import { AdDetailsModal } from '../components/orders/AdDetailsModal';
import type { Order } from '../types/orderTypes';
import { Header } from '../components/account/Header';
import { Menu } from '../components/account/Menu';
import { ProfileModal } from '../components/account/ProfileModal';
import { apiFetch } from '../api';

const MyOrders: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
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
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await apiFetch<CampaignData[]>('/api/ads/company/my');
            const ordersData: Order[] = data.map((campaign) => ({
                id: campaign.id,
                name: campaign.productName || 'Без названия',
                description: campaign.productDescription || '',
                status: campaign.status === 0 ? 'создан' : campaign.status === 1 ? 'ожидает' : 'завершён',
                fullData: campaign,
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

    return (
        <div className="my-orders-container">
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
            <h1>Мои заказы</h1>
            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <OrderList orders={orders} onOrderClick={handleOrderClick} />
            )}
        </div>
    );
};

export default MyOrders;