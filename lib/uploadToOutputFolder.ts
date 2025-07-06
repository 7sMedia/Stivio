export async function uploadToOutputFolder(
  accessToken: string,
  outputFolderPath: string,
  file: File
): Promise<{ path_display: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const filePath = `${outputFolderPath}/${file.name}`;

  const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: filePath,
        mode: "add",
        autorename: true,
        mute: false,
        strict_conflict: false,
      }),
      "Content-Type": "application/octet-stream",
    },
    body: arrayBuffer,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
}
