// lib/dropboxUpload.ts
import { Dropbox } from "dropbox";

export async function uploadToDropbox(file: File, path: string) {
  try {
    const dbx = new Dropbox({
      accessToken: localStorage.getItem("dropbox_access_token") || "",
      fetch,
    });

    const res = await dbx.filesUpload({
      path,
      contents: file,
      mode: { ".tag": "overwrite" },
    });

    return { success: true, data: res };
  } catch (error) {
    console.error("Dropbox upload error:", error);
    return { success: false, error };
  }
}
