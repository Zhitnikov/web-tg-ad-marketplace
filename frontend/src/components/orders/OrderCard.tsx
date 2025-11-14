import React from 'react';
import type { Order } from '../../types/orderTypes';

interface OrderCardProps {
    order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const handleMenuClick = () => {
        // TODO: Логика для ...
        console.log('Menu clicked for order:', order.id);
    };

    return (
        <div className="order-card">
            <div className="order-card-header">
                <h3>{order.name}</h3>
                <button className="menu-button" onClick={handleMenuClick}>
                    ⋮
                </button>
            </div>
            <p className="order-description">{order.description}</p>
            <span className={`order-status status-${order.status}`}>{order.status}</span>
        </div>
    );
};

export default OrderCard;