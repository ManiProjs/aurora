import RPC from "discord-rpc";

const CLIENT_ID = "1531259992076718090";

let rpc: RPC.Client | null = null;

export function startDiscordRPC(): Promise<boolean> {
  if (rpc) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const client = new RPC.Client({
      transport: "ipc",
    });

    rpc = client;

    let settled = false;

    const finish = (value: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(value);
    };

    client.once("ready", () => {
      console.log("Discord Rich Presence connected");

      finish(true);
    });

    client.on("error", (error) => {
      console.error("Discord RPC error:", error);

      rpc = null;

      finish(false);
    });

    client.on("disconnected", () => {
      console.log("Discord RPC disconnected");

      rpc = null;
    });

    client
      .login({
        clientId: CLIENT_ID,
      })
      .catch((error) => {
        console.error("Discord RPC unavailable:", error);

        rpc = null;

        finish(false);
      });
  });
}

export function updateDiscordRPC({
  title,
  artist,
  album,
  duration,
}: {
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
}) {
  if (!rpc) {
    return;
  }

  const now = Date.now();

  rpc.setActivity({
    details: "Listening on Aurora",

    state: `${artist ?? "Unknown Artist"} • ${title}`,

    largeImageKey: "aurora",

    largeImageText: album ?? "Aurora",

    startTimestamp: now,

    endTimestamp: duration ? now + duration * 1000 : undefined,

    instance: false,
  });
}

export function stopDiscordRPC() {
  if (!rpc) {
    return;
  }

  rpc.clearActivity();

  rpc.destroy();

  rpc = null;
}
