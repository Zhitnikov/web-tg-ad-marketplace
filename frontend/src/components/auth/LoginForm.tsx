import React, { useState } from 'react';
import type  { FormEvent } from 'react';
import type { LoginFormData } from '../../types/authTypes';

interface LoginFormProps {
    formData: LoginFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>, loginInput: string) => void;
    isValidEmail: (value: string) => boolean;
    isValidPhone: (value: string) => boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, handleInputChange, handleSubmit, isValidEmail, isValidPhone }) => {
    const [loginInput, setLoginInput] = useState<string>('');
    const isValidLogin = (value: string) => isValidEmail(value) || isValidPhone(value);
    const isDisabled = !loginInput || !isValidLogin(loginInput) || !formData.password;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e, loginInput);
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Email или Телефон</label>
                <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Пароль</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit" disabled={isDisabled}>
                Войти
            </button>
        </form>
    );
};

export default LoginForm;