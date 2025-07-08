import { Dropbox } from "dropbox";
import { fetchWithDropboxRetry } from "@/lib/dropboxLimiter";

export async function uploadToDropbox({
  file,
  folderPath,
}: {
  file: File;
  folderPath: string;
}) {
  // ✅ Protect browser-only logic
  if (typeof window === "undefined") {
    throw new Error("Dropbox upload can only run in the browser.");
  }

  const accessToken = localStorage.getItem("dropbox_access_token");
  if (!accessToken) {
    throw new Error("Dropbox not authenticated.");
  }

  const dbx = new Dropbox({ accessToken, fetch: fetchWithDropboxRetry });
  const fileName = file.name;
  const dropboxPath = `${folderPath}/${fileName}`;
  const fileBuffer = await file.arrayBuffer();

  try {
    const uploadResult = await dbx.filesUpload({
      path: dropboxPath,
      contents: fileBuffer,
      mode: { ".tag": "add" },
      autorename: true,
      mute: true,
    });

    const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
      path: uploadResult.result.path_lower!,
    });

    const rawLink = sharedLink.result.url.replace("?dl=0", "?raw=1");

    return {
      name: fileName,
      url: rawLink,
      dropboxPath: uploadResult.result.path_lower,
      fromDropbox: true,
    };
  } catch (error: any) {
    console.error("Dropbox upload failed:", error);
    throw new Error(error?.message || "Dropbox upload failed.");
  }
}
