import React, { useState } from 'react';
import WalletForm from '../components/wallet/WalletForm';
import { Header } from '../components/account/Header';
import { Menu } from '../components/account/Menu';
import { ProfileModal } from '../components/account/ProfileModal';

const WalletReplenish: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="wallet-page">
            <Header
                onMenuClick={() => setIsMenuOpen(true)}
                onProfileClick={() => setIsProfileOpen(true)}
                variant="red"
            />
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <div className="wallet-replenish-container">
                <h1>Пополнение кошелька</h1>
                <WalletForm />
            </div>
        </div>
    );
};

export default WalletReplenish;