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
  }
}
