export interface Order {
    id: string;
    name: string;
    description: string;
    status: 'ожидает' | 'завершён' | 'создан' | 'отклонён';
    fullData?: any; // Полные данные рекламы для модального окна
}