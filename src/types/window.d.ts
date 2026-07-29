export {};

declare global {
  interface Window {
    auth: {
      saveAuth(auth: {
        server: string;
        username: string;
        password: string;
      }): Promise<void>;

      loadAuth(): Promise<{
        server: string;
        username: string;
        password: string;
      } | null>;

      clearAuth(): Promise<void>;
    };

    discord?: {
      update(data: {
        title: string;
        artist?: string;
        album?: string;
        duration?: number;
      }): Promise<void>;

      start(): Promise<boolean>;

      stop(): Promise<void>;
    };

    updater: {
      onUpdate(callback: (event: string, data?: unknown) => void): void;
    };
  }
}
