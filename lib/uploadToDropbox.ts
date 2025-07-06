// /lib/uploadToDropbox.ts
import { Dropbox } from "dropbox";

export async function uploadToDropbox(file: File, inputFolderPath: string) {
  const accessToken = localStorage.getItem("dropbox_access_token");
  if (!accessToken) throw new Error("Dropbox not authenticated.");

  const dbx = new Dropbox({ accessToken, fetch });

  const arrayBuffer = await file.arrayBuffer();
  const dropboxPath = `${inputFolderPath}/${file.name}`;

  const response = await dbx.filesUpload({
    path: dropboxPath,
    contents: arrayBuffer,
    mode: { ".tag": "overwrite" },
  });

  const linkRes = await dbx.sharingCreateSharedLinkWithSettings({
    path: response.result.path_lower!,
  });

  return {
    name: file.name,
    url: linkRes.result.url.replace("?dl=0", "?raw=1"),
    dropboxPath: response.result.path_lower,
    fromDropbox: true,
  };
}
