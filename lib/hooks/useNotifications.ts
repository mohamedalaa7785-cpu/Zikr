'use client';

import { useCallback, useEffect, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  getNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    loading,
    error,
    getNotifications,
    markAsRead,
    deleteNotification,
  };
}
