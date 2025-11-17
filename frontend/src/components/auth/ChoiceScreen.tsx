import React from 'react';

interface ChoiceScreenProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

const ChoiceScreen: React.FC<ChoiceScreenProps> = ({ onLoginClick, onRegisterClick }) => {
    return (
        <div className="choice-container">
            <button className="choice-button" onClick={onLoginClick}>
                Войти
            </button>
            <button className="choice-button" onClick={onRegisterClick}>
                Зарегистрироваться
            </button>
        </div>
    );
};

export default ChoiceScreen;