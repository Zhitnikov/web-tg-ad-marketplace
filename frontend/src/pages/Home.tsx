import React from 'react';
import AccountInfo from '../components/home/AccountInfo';
import MiniOrders from '../components/home/MiniOrders';
import Balance from '../components/home/Balance';
import SupportButton from '../components/home/SupportButton';

const mockEmail = 'user@example.com';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <AccountInfo email={mockEmail} />
            <MiniOrders />
            <Balance />
            <SupportButton />
        </div>
    );
};

export default Home;