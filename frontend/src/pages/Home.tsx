import React, { useState } from 'react';
import AccountInfo from '../components/home/AccountInfo';
import MiniOrders from '../components/home/MiniOrders';
import Balance from '../components/home/Balance';
import SupportButton from '../components/home/SupportButton';
import { Header } from '../components/account/Header';
import { Menu } from '../components/account/Menu';
import { ProfileModal } from '../components/account/ProfileModal';

const mockEmail = 'user@example.com';

const Home: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="home-page">
            <Header
                onMenuClick={() => setIsMenuOpen(true)}
                onProfileClick={() => setIsProfileOpen(true)}
                variant="red"
            />
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <div className="home-container">
                <AccountInfo email={mockEmail} />
                <MiniOrders />
                <Balance />
                <SupportButton />
            </div>
        </div>
    );
};

export default Home;