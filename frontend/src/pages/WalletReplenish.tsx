import React from 'react';
import WalletForm from '../components/wallet/WalletForm';

const WalletReplenish: React.FC = () => {
    return (
        <div className="wallet-replenish-container">
            <h1>Пополнение кошелька</h1>
            <WalletForm />
        </div>
    );
};

export default WalletReplenish;