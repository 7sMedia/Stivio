// lib/dropboxUpload.ts
import { Dropbox } from "dropbox";

export async function uploadToDropbox({
  accessToken,
  file,
  dropboxPath,
}: {
  accessToken: string;
  file: File;
  dropboxPath: string;
}) {
  const dbx = new Dropbox({ accessToken, fetch });

  const fileBuffer = await file.arrayBuffer();

  try {
    const response = await dbx.filesUpload({
      path: `${dropboxPath}/${file.name}`,
      contents: fileBuffer,
      mode: { ".tag": "add" }, // dedupes by default
      autorename: true,
    });

    return response;
  } catch (error) {
    console.error("Dropbox upload failed:", error);
    throw error;
  }
}
