import React, { useState, useEffect } from 'react';
import OrderCard from '../orders/OrderCard';
import type { Order } from '../../types/orderTypes';
import { apiFetch } from '../../api';
import { useUserRole } from '../../hooks/useUserRole';

interface MiniOrdersProps {
    onOrderClick?: (order: Order) => void;
}

interface CampaignData {
    id: string;
    productName?: string;
    productDescription?: string;
    status?: number;
}

interface AdToPostData {
    id: string;
    adTitle?: string;
    adContent?: string;
    postStatus?: number;
}

const MiniOrders: React.FC<MiniOrdersProps> = ({ onOrderClick }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { role } = useUserRole();

    useEffect(() => {
        if (role) {
            loadOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    const loadOrders = async () => {
        try {
            if (role === 'Company') {
                // Для компаний загружаем кампании
                const campaigns = await apiFetch<CampaignData[]>('/api/ads/company/my');
                const ordersData: Order[] = campaigns.map((campaign) => ({
                    id: campaign.id,
                    name: campaign.productName || 'Без названия',
                    description: campaign.productDescription || '',
                    status: campaign.status === 0 ? 'создан' : campaign.status === 1 ? 'ожидает' : 'завершён',
                    fullData: campaign,
                }));
                setOrders(ordersData.slice(0, 3)); // Показываем только первые 3
            } else if (role === 'Channel') {
                // Для каналов загружаем принятые рекламы
                const ads = await apiFetch<AdToPostData[]>('/api/ads/channel/pending');
                const ordersData: Order[] = ads.map((ad) => ({
                    id: ad.id,
                    name: ad.adTitle || 'Без названия',
                    description: ad.adContent || '',
                    status: ad.postStatus === 0 ? 'создан' : ad.postStatus === 1 ? 'ожидает' : 'завершён',
                    fullData: ad,
                }));
                setOrders(ordersData.slice(0, 3)); // Показываем только первые 3
            }
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mini-orders">
            <h2>Мои заказы</h2>
            {loading ? (
                <div>Загрузка...</div>
            ) : orders.length > 0 ? (
                <div className="mini-orders-list">
                    {orders.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onClick={onOrderClick ? () => onOrderClick(order) : undefined}
                        />
                    ))}
                </div>
            ) : (
                <div>Заказов пока нет</div>
            )}
        </div>
    );
};

export default MiniOrders;