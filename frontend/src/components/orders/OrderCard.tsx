import React, { useState, useRef, useEffect } from 'react';
import type { Order } from '../../types/orderTypes';

interface OrderCardProps {
    order: Order;
    onClick?: () => void;
    onEdit?: (order: Order) => void;
    onDelete?: (orderId: string) => void;
    onPublish?: (orderId: string) => void;
    onContact?: (order: Order) => void;
    showPublish?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, onEdit, onDelete, onPublish, onContact, showPublish = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        if (onEdit) {
            onEdit(order);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        if (onDelete && window.confirm('Вы уверены, что хотите удалить эту рекламу?')) {
            onDelete(order.id);
        }
    };

    const handlePublish = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        if (onPublish) {
            onPublish(order.id);
        }
    };

    return (
        <div className="order-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="order-card-header">
                <h3>{order.name}</h3>
                <div className="order-card-menu" ref={menuRef}>
                    <button className="menu-button" onClick={handleMenuClick}>
                        ⋮
                    </button>
                    {isMenuOpen && (
                        <div className="order-card-menu-dropdown">
                            {onEdit && (
                                <button className="menu-item" onClick={handleEdit}>
                                    Редактировать
                                </button>
                            )}
                            {showPublish && onPublish && order.status === 'создан' && (
                                <button className="menu-item" onClick={handlePublish}>
                                    Опубликовать
                                </button>
                            )}
                            {onDelete && order.status === 'создан' && (
                                <button className="menu-item menu-item--danger" onClick={handleDelete}>
                                    Удалить
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <p className="order-description">{order.description}</p>
            <div className="order-card-footer">
                <span className={`order-status status-${order.status}`}>{order.status}</span>
                {onContact && order.status === 'ожидает' && (
                    <button
                        type="button"
                        className="order-card-contact-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onContact(order);
                        }}
                    >
                        Связаться с каналом
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderCard;