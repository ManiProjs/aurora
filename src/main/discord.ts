import RPC from "discord-rpc";

const CLIENT_ID = "1531259992076718090";

let rpc: RPC.Client | null = null;
let connected = false;
let retryTimer: NodeJS.Timeout | null = null;

export async function startDiscordRPC(): Promise<boolean> {
  if (connected && rpc) {
    return true;
  }

  const client = new RPC.Client({
    transport: "ipc",
  });

  return new Promise((resolve) => {
    client.once("ready", () => {
      console.log("Discord RPC connected");

      rpc = client;
      connected = true;

      resolve(true);
    });

    client.once("error", (error) => {
      console.error("Discord RPC error:", error);

      rpc = null;
      connected = false;

      resolve(false);
    });

    client
      .login({
        clientId: CLIENT_ID,
      })
      .catch((error) => {
        console.error("Discord RPC login failed:", error);

        rpc = null;
        connected = false;

        resolve(false);
      });
  });
}

export function startDiscordRPCRetry() {
  if (retryTimer) {
    return;
  }

  retryTimer = setInterval(async () => {
    if (connected) {
      stopDiscordRPCRetry();
      return;
    }

    console.log("Retrying Discord RPC...");

    const success = await startDiscordRPC();

    if (success) {
      stopDiscordRPCRetry();
    }
  }, 5000);
}

export function stopDiscordRPCRetry() {
  if (!retryTimer) {
    return;
  }

  clearInterval(retryTimer);
  retryTimer = null;
}

export function updateDiscordRPC(data: {
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  isPlaying?: boolean;
}) {
  if (!rpc || !connected) {
    console.log("Discord RPC not connected");
    return;
  }

  rpc.setActivity({
    details:
      data.isPlaying === false ? "Paused on Aurora" : "Listening on Aurora",

    state: `${data.artist ?? "Unknown Artist"} • ${data.title}`,

    largeImageKey: "aurora",

    largeImageText: data.album ?? "Aurora",

    buttons: [
      {
        label: data.isPlaying === false ? "Play" : "Pause",

        url: "https://github.com/ManiProjs/Aurora",
      },
    ],

    instance: false,
  });
}

export function stopDiscordRPC() {
  stopDiscordRPCRetry();

  if (!rpc) {
    return;
  }

  rpc.clearActivity();
  rpc.destroy();

  rpc = null;
  connected = false;
}
