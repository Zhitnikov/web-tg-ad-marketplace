import React, { useState, useEffect } from 'react';
import AccountInfo from '../components/home/AccountInfo';
import MiniOrders from '../components/home/MiniOrders';
import Balance from '../components/home/Balance';
import SupportButton from '../components/home/SupportButton';
import { Header } from '../components/account/Header';
import { Menu } from '../components/account/Menu';
import { ProfileModal } from '../components/account/ProfileModal';
import { AdDetailsModal } from '../components/orders/AdDetailsModal';
import { apiFetch } from '../api';
import type { Order } from '../types/orderTypes';

const Home: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [email, setEmail] = useState<string>('');
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

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await apiFetch<{ email: string }>('/api/user/profile');
            setEmail(profile.email);
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
        }
    };

    const handleOrderClick = (order: Order) => {
        if (order.fullData) {
            setSelectedAd(order.fullData);
            setIsAdModalOpen(true);
        }
    };

    return (
        <div className="home-page">
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
            <div className="home-container">
                <AccountInfo email={email} />
                <MiniOrders onOrderClick={handleOrderClick} />
                <Balance />
                <SupportButton />
            </div>
        </div>
    );
};

export default Home;