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
      start(): Promise<{
        success: boolean;
        error?: string;
      }>;

      stop(): Promise<{
        success: boolean;
      }>;

      update(data: {
        title: string;
        artist?: string;
        album?: string;
        duration?: number;
      }): Promise<{
        success: boolean;
      }>;
    };

    updater: {
      onUpdate(callback: (event: string, data?: unknown) => void): void;
    };
  }
}
