import React from 'react';

const SupportButton: React.FC = () => {
    const handleSupportClick = () => {
        console.log('Открытие поддержки');
        // TODO: Логика
    };

    return (
        <button className="support-button" onClick={handleSupportClick}>
            Поддержка
        </button>
    );
};

export default SupportButton;