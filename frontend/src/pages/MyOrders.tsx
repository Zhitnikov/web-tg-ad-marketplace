import React, { useState } from 'react';
import OrderList from '../components/orders/OrderList';
import type { Order } from '../types/orderTypes';
import { Header } from '../components/account/Header';
import { Menu } from '../components/account/Menu';
import { ProfileModal } from '../components/account/ProfileModal';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="my-orders-container">
            <Header
                onMenuClick={() => setIsMenuOpen(true)}
                onProfileClick={() => setIsProfileOpen(true)}
                variant="red"
            />
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <h1>Мои заказы</h1>
            <OrderList orders={mockOrders} />
        </div>
    );
};

export default MyOrders;