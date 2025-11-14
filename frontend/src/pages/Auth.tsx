import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData, RegisterFormData } from '../types/authTypes';
import ChoiceScreen from '../components/auth/ChoiceScreen';
import LoginForm from '../components/auth/LoginForm';
import RegisterEmailStep from '../components/auth/RegisterEmailStep';
import RegisterMainStep from '../components/auth/RegisterMainStep';

type Mode = 'choice' | 'login' | 'register-step1' | 'register-step2';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('choice');
    const [loginData, setLoginData] = useState<LoginFormData>({
        password: '',
    });
    const [registerData, setRegisterData] = useState<RegisterFormData>({
        email: '',
        phone: '',
        password: '',
        userType: '',
        city: '',
    });

    // Проверяем, залогинен ли пользователь при загрузке
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            navigate('/home', { replace: true });
        }
    }, [navigate]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>, loginInput: string) => {
        e.preventDefault();
        let updatedData: LoginFormData = { ...loginData };
        if (isValidEmail(loginInput)) {
            updatedData = { ...updatedData, email: loginInput, phone: undefined };
        } else if (isValidPhone(loginInput)) {
            updatedData = { ...updatedData, phone: loginInput, email: undefined };
        }
        console.log('Данные входа:', updatedData);
        
        // TODO: API для входа
        // После успешной авторизации:
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home', { replace: true });
    };

    const handleRegisterEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMode('register-step2');
    };

    const handleRegisterMainSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Данные регистрации:', registerData);
        
        // TODO: API для регистрации
        // После успешной регистрации:
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home', { replace: true });
    };

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValidPhone = (value: string) => /^\+?\d{10,15}$/.test(value);
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    let title = 'Авторизация';
    if (mode === 'login') title = 'Вход';
    if (mode.startsWith('register-')) title = 'Регистрация';

    return (
        <div className="auth-container">
            <h1>{title}</h1>
            {mode === 'choice' && (
                <ChoiceScreen
                    onLoginClick={() => setMode('login')}
                    onRegisterClick={() => setMode('register-step1')}
                />
            )}
            {mode === 'login' && (
                <LoginForm
                    formData={loginData}
                    handleInputChange={handleLoginChange}
                    handleSubmit={handleLoginSubmit}
                    isValidEmail={isValidEmail}
                    isValidPhone={isValidPhone}
                />
            )}
            {mode === 'register-step1' && (
                <RegisterEmailStep
                    formData={registerData}
                    handleInputChange={handleRegisterChange}
                    handleSubmit={handleRegisterEmailSubmit}
                    isValidEmail={isValidEmail}
                />
            )}
            {mode === 'register-step2' && (
                <RegisterMainStep
                    formData={registerData}
                    handleInputChange={handleRegisterChange}
                    handleSubmit={handleRegisterMainSubmit}
                    isValidPhone={isValidPhone}
                    isValidUrl={isValidUrl}
                />
            )}
        </div>
    );
};

export default Auth;