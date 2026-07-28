import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import {
  useNotificationStore,
  type NotificationType,
} from "../stores/notifications";

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle />,
  error: <XCircle />,
  info: <Info />,
  warning: <AlertTriangle />,
};

export default function Notifications() {
  const notifications = useNotificationStore((s) => s.notifications);

  const removeNotification = useNotificationStore((s) => s.removeNotification);

  return (
    <div
      className="
        fixed
        right-6
        top-6
        z-[9999]
        flex
        w-96
        flex-col
        gap-3
      "
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}

            initial={{
              opacity: 0,
              x: 50,
              scale: 0.95,
            }}

            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              x: 50,
            }}

            className="
              aurora-glass
              flex
              items-start
              gap-3
              rounded-2xl
              p-4
              shadow-xl
            "
          >
            <div>{icons[notification.type]}</div>

            <div className="flex-1">
              <p className="font-semibold">{notification.title}</p>

              {notification.message && (
                <p className="text-sm aurora-text-muted">
                  {notification.message}
                </p>
              )}
            </div>

            <button onClick={() => removeNotification(notification.id)}>
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
