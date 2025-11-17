import React from 'react';

const cities = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Красноярск', 'Челябинск', 'Самара', 'Уфа',
    'Ростов-на-Дону', 'Омск', 'Краснодар', 'Воронеж', 'Пермь',
    'Волгоград', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск'
];

interface CitySelectorProps {
    city: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ city, handleChange }) => {
    return (
        <div className="form-group">
            <label>Город</label>
            <input
                type="text"
                name="city"
                list="cities"
                value={city}
                onChange={handleChange}
                required
            />
            <datalist id="cities">
                {cities.map((cityName) => (
                    <option key={cityName} value={cityName} />
                ))}
            </datalist>
        </div>
    );
};

export default CitySelector;