export interface Order {
    id: string;
    name: string;
    description: string;
    status: 'создан' | 'ожидает' | 'опубликован' | 'неизвестно';
    fullData?: any;
}