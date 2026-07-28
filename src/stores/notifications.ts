import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];

  addNotification(notification: Omit<Notification, "id">): void;

  removeNotification(id: number): void;

  clearNotifications(): void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification(notification) {
    const id = Date.now();

    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id,
          ...notification,
        },
      ],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((item) => item.id !== id),
      }));
    }, 4000);
  },

  removeNotification(id) {
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    }));
  },

  clearNotifications() {
    set({
      notifications: [],
    });
  },
}));
