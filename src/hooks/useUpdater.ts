import { useEffect } from "react";

import { useNotificationStore } from "../stores/notifications";

export function useUpdater() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!window.updater) {
      return;
    }

    window.updater.onUpdate((event, data) => {
      switch (event) {
        case "update:checking":
          addNotification({
            title: "Checking for updates",
            message: "Looking for a new Aurora version...",
            type: "info",
          });
          break;

        case "update:available":
          addNotification({
            title: "Update available",
            message: `Aurora ${data} is available.`,
            type: "info",
          });
          break;

        case "update:progress":
          addNotification({
            title: "Downloading update",
            message: `${data}% downloaded.`,
            type: "info",
          });
          break;

        case "update:downloaded":
          addNotification({
            title: "Update ready",
            message: `Aurora ${data} has been downloaded. Restart to install.`,
            type: "success",
          });
          break;

        case "update:error":
          addNotification({
            title: "Update failed",
            message: String(data),
            type: "error",
          });
          break;
      }
    });
  }, [addNotification]);
}
