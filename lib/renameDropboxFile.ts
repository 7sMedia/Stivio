export async function renameDropboxFile(
  accessToken: string,
  fromPath: string,
  toPath: string
): Promise<void> {
  const response = await fetch("https://api.dropboxapi.com/2/files/move_v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from_path: fromPath,
      to_path: toPath,
      autorename: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
}
