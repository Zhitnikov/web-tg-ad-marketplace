import React from 'react';
import OrderList from '../components/orders/OrderList';
import type { Order } from '../types/orderTypes';

const mockOrders: Order[] = [
    {
        id: '1',
        name: 'Картина с изображением моря',
        description: 'Не просто картина, а то чувство, когда просыпаешься и выходишь на веранду маленького домика в Италии.',
        status: 'создан',
    },
    {
        id: '2',
        name: 'Скульптура абстрактная',
        description: 'Современное искусство для вашего интерьера.',
        status: 'ожидает',
    },
    {
        id: '3',
        name: 'Фото на холсте',
        description: 'Ваши воспоминания в вечном формате.',
        status: 'завершён',
    },
    {
        id: '4',
        name: 'Графика с городским пейзажем',
        description: 'Урбанистический стиль для современного дома.',
        status: 'отклонён',
    },
];

const MyOrders: React.FC = () => {
    return (
        <div className="my-orders-container">
            <h1>Мои заказы</h1>
            <OrderList orders={mockOrders} />
        </div>
    );
};

export default MyOrders;