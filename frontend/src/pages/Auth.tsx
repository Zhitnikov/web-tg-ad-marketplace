import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData, RegisterFormData } from '../types/authTypes';
import ChoiceScreen from '../components/auth/ChoiceScreen';
import LoginForm from '../components/auth/LoginForm';
import RegisterEmailStep from '../components/auth/RegisterEmailStep';
import RegisterMainStep from '../components/auth/RegisterMainStep';
import { apiFetch, setAuthToken } from '../api';
import { Notification } from '../components/Notification';

type Mode = 'choice' | 'login' | 'register-step1' | 'register-step2';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('choice');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('error');
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

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>, loginInput: string) => {
        e.preventDefault();
        let updatedData: LoginFormData = { ...loginData };
        if (isValidEmail(loginInput)) {
            updatedData = { ...updatedData, email: loginInput, phone: undefined };
        } else if (isValidPhone(loginInput)) {
            // На бэк отправляем только email, поэтому если ввели телефон, пока просто логируем
            console.warn('Логин по телефону пока не поддержан на бэкенде');
            return;
        }

        if (!updatedData.email) {
            return;
        }

        try {
            const result = await apiFetch<{ token: string }>('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: updatedData.email,
                    password: updatedData.password,
                }),
            }, false);

            setAuthToken(result.token);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/home', { replace: true });
        } catch (error: any) {
            console.error('Ошибка авторизации', error);
            const errorMessage = error?.message?.includes('Invalid email or password') 
                ? 'Неверный email или пароль' 
                : 'Ошибка при входе. Проверьте данные и попробуйте снова.';
            setNotificationMessage(errorMessage);
            setNotificationType('error');
            setShowNotification(true);
        }
    };

    const handleRegisterEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMode('register-step2');
    };

    const handleRegisterMainSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const role = registerData.userType === 'channel' ? 'Channel' : 'Company';

            const payload = {
                email: registerData.email,
                password: registerData.password,
                firstName: '', // в текущей форме нет этих полей
                lastName: '',
                telephone: registerData.phone,
                role,
                companyName: registerData.companyName,
                description: undefined,
                channelName: registerData.channelTheme,
                channelLink: registerData.channelLink,
                city: registerData.city,
                channelTheme: registerData.channelTheme,
                channelDescription: registerData.channelDescription,
                membersAge: undefined,
            };

            await apiFetch('/api/auth/register/user', {
                method: 'POST',
                body: JSON.stringify(payload),
            }, false);

            // После успешной регистрации сразу логиним пользователя
            if (registerData.email && registerData.password) {
                const loginResult = await apiFetch<{ token: string }>('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: registerData.email,
                        password: registerData.password,
                    }),
                }, false);

                setAuthToken(loginResult.token);
                localStorage.setItem('isAuthenticated', 'true');
            }

            navigate('/home', { replace: true });
        } catch (error: any) {
            console.error('Ошибка регистрации', error);
            const errorMessage = error?.message?.includes('Email уже используется')
                ? 'Email уже используется'
                : 'Ошибка при регистрации. Попробуйте снова.';
            setNotificationMessage(errorMessage);
            setNotificationType('error');
            setShowNotification(true);
        }
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
            {showNotification && (
                <Notification
                    message={notificationMessage}
                    type={notificationType}
                    onClose={() => setShowNotification(false)}
                />
            )}
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