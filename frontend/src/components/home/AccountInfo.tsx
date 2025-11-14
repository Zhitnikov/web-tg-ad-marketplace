import React from 'react';

interface AccountInfoProps {
    email: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ email }) => {
    return (
        <div className="account-info">
            <h2>Данные аккаунта</h2>
            <p>Email: {email}</p>
        </div>
    );
};

export default AccountInfo;