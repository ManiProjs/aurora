export {};

declare global {
  interface Window {
    auth: {
      save(auth: {
        server: string;
        username: string;
        password: string;
      }): Promise<void>;

      load(): Promise<{
        server: string;
        username: string;
        password: string;
      } | null>;

      clear(): Promise<void>;
    };

    discord: {
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

    themes: {
      list(): Promise<
        {
          file: string;
          id: string;
          name: string;
          author?: string;
          version?: string;
          description?: string;
          variant?: string;
          preview?: string;
        }[]
      >;

      load(file: string): Promise<string>;
    };
  }
}
