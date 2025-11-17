import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

const Balance: React.FC = () => {
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBalance();
    }, []);

    const loadBalance = async () => {
        try {
            const data = await apiFetch<{ balance: number }>('/api/user/balance');
            setBalance(data.balance);
        } catch (error) {
            console.error('Ошибка загрузки баланса:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="balance">
            <h2>Баланс</h2>
            {loading ? <p>Загрузка...</p> : <p>{balance.toFixed(2)} руб.</p>}
        </div>
    );
};

export default Balance;