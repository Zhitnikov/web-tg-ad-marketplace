import React from 'react';
import type { RegisterFormData } from '../../types/authTypes';

interface CompanyFieldsProps {
    formData: RegisterFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyFields: React.FC<CompanyFieldsProps> = ({ formData, handleInputChange }) => {
    return (
        <div className="form-group">
            <label>Название компании</label>
            <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleInputChange}
                required
            />
        </div>
    );
};

export default CompanyFields;