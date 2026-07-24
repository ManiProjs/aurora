export function getCoverArtUrl(
  server: string,
  username: string,
  password: string,
  coverArt: string,
) {
  return (
    `${server}/rest/getCoverArt?` +
    new URLSearchParams({
      id: coverArt,
      u: username,
      p: password,
      v: "1.16.1",
      c: "Aurora",
      size: "500",
    })
  );
}
