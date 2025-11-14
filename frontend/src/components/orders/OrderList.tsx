import React from 'react';
import type { Order } from '../../types/orderTypes';
import OrderCard from './OrderCard';

interface OrderListProps {
    orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
    return (
        <div className="order-list">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
};

export default OrderList;