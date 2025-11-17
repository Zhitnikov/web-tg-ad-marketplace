import React from 'react';
import type { RegisterFormData } from '../../types/authTypes';
import CitySelector from './CitySelector';
import ChannelFields from './ChannelFields';
import CompanyFields from './CompanyFields';

interface RegisterMainStepProps {
    formData: RegisterFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isValidPhone: (phone: string) => boolean;
    isValidUrl: (url: string) => boolean;
}

const RegisterMainStep: React.FC<RegisterMainStepProps> = ({ formData, handleInputChange, handleSubmit, isValidPhone, isValidUrl }) => {
    const isChannelValid = formData.userType === 'channel' && formData.channelTheme && formData.channelLink && isValidUrl(formData.channelLink);
    const isCompanyValid = formData.userType === 'company' && formData.companyName;
    const isTypeSelected = formData.userType !== '';
    const isDisabled = !formData.phone || !isValidPhone(formData.phone) || !formData.password || !isTypeSelected || !formData.city || !(isChannelValid || isCompanyValid);

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Телефон</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
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
            <div className="form-group">
                <label>Кто вы?</label>
                <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите...</option>
                    <option value="channel">Канал (продаю место для рекламы)</option>
                    <option value="company">Компания (покупаю рекламу)</option>
                </select>
            </div>
            {formData.userType === 'channel' && (
                <ChannelFields formData={formData} handleInputChange={handleInputChange} />
            )}
            {formData.userType === 'company' && (
                <CompanyFields formData={formData} handleInputChange={handleInputChange} />
            )}
            <CitySelector city={formData.city} handleChange={handleInputChange} />
            <button type="submit" disabled={isDisabled}>
                Продолжить
            </button>
        </form>
    );
};

export default RegisterMainStep;