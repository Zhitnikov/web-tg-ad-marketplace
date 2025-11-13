import React from 'react';
import type { RegisterFormData } from '../../types/authTypes';

interface RegisterEmailStepProps {
    formData: RegisterFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isValidEmail: (email: string) => boolean;
}

const RegisterEmailStep: React.FC<RegisterEmailStepProps> = ({ formData, handleInputChange, handleSubmit, isValidEmail }) => {
    const isDisabled = !formData.email || !isValidEmail(formData.email);

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit" disabled={isDisabled}>
                Выслать код
            </button>
        </form>
    );
};

export default RegisterEmailStep;