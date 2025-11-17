export interface LoginFormData {
    email?: string;
    phone?: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    phone: string;
    password: string;
    userType: 'channel' | 'company' | '';
    city: string;

    channelTheme?: string;
    channelLink?: string;
    channelDescription?: string;

    companyName?: string;
}