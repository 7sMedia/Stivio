// lib/dropboxUpload.ts

import { Dropbox } from "dropbox";

export async function uploadToDropbox({
  file,
  accessToken,
  folderPath,
  modifiedFilename,
}: {
  file: File;
  accessToken: string;
  folderPath: string;
  modifiedFilename: string;
}): Promise<{ path: string; name: string }> {
  const dbx = new Dropbox({ accessToken });

  const arrayBuffer = await file.arrayBuffer();
  const dropboxPath = `${folderPath}/${modifiedFilename}`;

  try {
    const res = await dbx.filesUpload({
      path: dropboxPath,
      contents: arrayBuffer,
      mode: { ".tag": "overwrite" },
    });

    return {
      path: res.result.path_display ?? dropboxPath,
      name: res.result.name,
    };
  } catch (err) {
    console.error("Dropbox upload error:", err);
    throw err;
  }
}
