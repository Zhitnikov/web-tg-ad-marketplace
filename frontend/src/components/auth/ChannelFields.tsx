import React from 'react';
import type { RegisterFormData } from '../../types/authTypes';

interface ChannelFieldsProps {
    formData: RegisterFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChannelFields: React.FC<ChannelFieldsProps> = ({ formData, handleInputChange }) => {
    return (
        <>
            <div className="form-group">
                <label>Тема канала</label>
                <input
                    type="text"
                    name="channelTheme"
                    value={formData.channelTheme || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Ссылка на канал</label>
                <input
                    type="url"
                    name="channelLink"
                    value={formData.channelLink || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Описание канала (опционально)</label>
                <input
                    type="text"
                    name="channelDescription"
                    value={formData.channelDescription || ''}
                    onChange={handleInputChange}
                />
            </div>
        </>
    );
};

export default ChannelFields;