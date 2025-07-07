// lib/uploadToDropboxWithRateLimit.ts

import { Dropbox } from "dropbox";

let lastUploadTimestamp = 0;

export async function uploadToDropboxWithRateLimit({
  file,
  filename,
  accessToken,
  folderPath = "/Apps/Beta7/Outputs",
}: {
  file: File;
  filename: string;
  accessToken: string;
  folderPath?: string;
}) {
  if (!accessToken) throw new Error("Dropbox not authenticated");

  const now = Date.now();
  const elapsed = now - lastUploadTimestamp;
  const minInterval = 3000; // 3 seconds between uploads (safe buffer under 10/min limit)

  if (elapsed < minInterval) {
    const waitTime = minInterval - elapsed;
    await new Promise((res) => setTimeout(res, waitTime));
  }

  lastUploadTimestamp = Date.now();

  const dbx = new Dropbox({ accessToken, fetch });
  const dropboxPath = `${folderPath}/${filename}`;
  const fileBuffer = await file.arrayBuffer();

  try {
    const uploadResult = await dbx.filesUpload({
      path: dropboxPath,
      contents: fileBuffer,
      mode: { ".tag": "add" },
      autorename: true,
      mute: false,
      strict_conflict: false,
    });

    const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
      path: uploadResult.result.path_lower!,
    });

    const rawLink = sharedLink.result.url.replace("?dl=0", "?raw=1");

    return {
      name: filename,
      url: rawLink,
      dropboxPath: uploadResult.result.path_lower,
      fromDropbox: true,
    };
  } catch (err: any) {
    console.error("Dropbox upload failed:", err);
    throw new Error(err?.message || "Dropbox upload failed.");
  }
}
