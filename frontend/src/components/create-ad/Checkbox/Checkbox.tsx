import React from 'react';
import './Checkbox.scss';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  name,
  id,
}) => {
  return (
    <label className="checkbox-label">
      <input
        type="checkbox"
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
        name={name}
        id={id}
      />
      <span className="checkbox-text">{label}</span>
    </label>
  );
};

