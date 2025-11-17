import React from 'react';
import type { Order } from '../../types/orderTypes';
import OrderCard from './OrderCard';

interface OrderListProps {
    orders: Order[];
    onOrderClick?: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderClick }) => {
    return (
        <div className="order-list">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} onClick={onOrderClick ? () => onOrderClick(order) : undefined} />
            ))}
        </div>
    );
};

export default OrderList;