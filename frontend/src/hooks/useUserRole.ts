import { useState, useEffect } from 'react';
import { apiFetch } from '../api';

type UserRole = 'Company' | 'Channel' | null;

export function useUserRole(): { role: UserRole; loading: boolean } {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const profile = await apiFetch<{ role: string }>('/api/user/profile');
        setRole(profile.role as UserRole);
      } catch (error) {
        console.error('Ошибка загрузки роли пользователя:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, []);

  return { role, loading };
}

