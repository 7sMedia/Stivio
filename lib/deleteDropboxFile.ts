export async function deleteDropboxFile(
  accessToken: string,
  path: string
): Promise<void> {
  const response = await fetch("https://api.dropboxapi.com/2/files/delete_v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
}
