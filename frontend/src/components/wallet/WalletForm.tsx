import React, { useState } from 'react';

interface FormData {
    amount: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    method: 'card' | 'sber' | 'tinkoff';
}

const WalletForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        amount: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        method: 'card',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const { apiFetch } = await import('../../api');
            const amount = parseFloat(formData.amount);
            
            if (isNaN(amount) || amount <= 0) {
                alert('Введите корректную сумму');
                return;
            }

            const result = await apiFetch<{ balance: number }>('/api/user/balance/replenish', {
                method: 'POST',
                body: JSON.stringify({ amount }),
            });

            alert(`Баланс успешно пополнен! Текущий баланс: ${result.balance.toFixed(2)} руб.`);
            
            // Очистка формы
            setFormData({
                amount: '',
                cardNumber: '',
                expiry: '',
                cvv: '',
                method: 'card',
            });
        } catch (error) {
            console.error('Ошибка пополнения баланса:', error);
            alert('Ошибка при пополнении баланса. Попробуйте позже.');
        }
    };

    const isValidAmount = parseFloat(formData.amount) > 0;
    const isValidCardNumber = /^\d{16}$/.test(formData.cardNumber);
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(formData.expiry);
    const isValidCvv = /^\d{3,4}$/.test(formData.cvv);
    const isDisabled = !isValidAmount || (formData.method === 'card' && (!isValidCardNumber || !isValidExpiry || !isValidCvv));

    return (
        <form className="wallet-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Сумма пополнения (руб.)</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Введите сумму"
                    required
                />
            </div>
            <div className="form-group">
                <label>Метод оплаты</label>
                <select
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                >
                    <option value="card">Банковская карта</option>
                    <option value="sber">Сбербанк</option>
                    <option value="tinkoff">Тинькофф</option>
                </select>
            </div>
            {formData.method === 'card' && (
                <>
                    <div className="form-group">
                        <label>Номер карты</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            maxLength={16}
                            required
                        />
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group">
                            <label>Срок действия</label>
                            <input
                                type="text"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                maxLength={4}
                                required
                            />
                        </div>
                    </div>
                </>
            )}
            <button type="submit" disabled={isDisabled}>
                Пополнить
            </button>
        </form>
    );
};

export default WalletForm;