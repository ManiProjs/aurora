import keytar from "keytar";

const SERVICE = "Aurora";

export async function saveAuth(auth: {
  server: string;
  username: string;
  password: string;
}) {
  await keytar.setPassword(SERVICE, "server", auth.server);

  await keytar.setPassword(SERVICE, "username", auth.username);

  await keytar.setPassword(SERVICE, "password", auth.password);
}

export async function loadAuth() {
  const server = await keytar.getPassword(SERVICE, "server");

  const username = await keytar.getPassword(SERVICE, "username");

  const password = await keytar.getPassword(SERVICE, "password");

  if (!server || !username || !password) {
    return null;
  }

  return {
    server,
    username,
    password,
  };
}
