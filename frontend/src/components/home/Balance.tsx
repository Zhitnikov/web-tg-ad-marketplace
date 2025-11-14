import React, { useState, useEffect } from 'react';

const Balance: React.FC = () => {
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        const storedBalance = localStorage.getItem('balance');
        setBalance(storedBalance ? parseFloat(storedBalance) : 0);
    }, []);

    return (
        <div className="balance">
            <h2>Баланс</h2>
            <p>{balance} руб.</p>
        </div>
    );
};

export default Balance;