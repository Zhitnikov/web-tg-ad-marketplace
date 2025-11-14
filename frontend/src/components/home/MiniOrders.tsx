import React from 'react';
import OrderCard from '../orders/OrderCard';
import type { Order } from '../../types/orderTypes';

const mockMiniOrders: Order[] = [
    {
        id: '1',
        name: 'Картина с изображением моря',
        description: 'Не просто картина, а то чувство...',
        status: 'создан',
    },
    {
        id: '2',
        name: 'Скульптура абстрактная',
        description: 'Современное искусство...',
        status: 'ожидает',
    },
];

const MiniOrders: React.FC = () => {
    return (
        <div className="mini-orders">
            <h2>Мои заказы</h2>
            <div className="mini-orders-list">
                {mockMiniOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
};

export default MiniOrders;