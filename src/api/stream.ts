export function getStreamUrl(
  server: string,
  username: string,
  password: string,
  songId: string,
) {
  return (
    `${server}/rest/stream?` +
    new URLSearchParams({
      id: songId,
      u: username,
      p: password,
      v: "1.16.1",
      c: "Aurora",
    })
  );
}
