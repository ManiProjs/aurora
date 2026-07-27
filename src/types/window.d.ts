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
      }): void;

      start(): void;

      stop(): void;
    };
  }
}
