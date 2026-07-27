import RPC from "discord-rpc";

const CLIENT_ID = "1531259992076718090";

let rpc: RPC.Client | null = null;

export async function startDiscordRPC() {
  if (rpc) {
    return;
  }

  rpc = new RPC.Client({
    transport: "ipc",
  });

  rpc.on("ready", () => {
    console.log("Discord Rich Presence connected");
  });

  try {
    await rpc.login({
      clientId: CLIENT_ID,
    });
  } catch (error) {
    console.log("Discord RPC unavailable:", error);

    rpc = null;
  }
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

    state: `${artist} • ${title}`,

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
