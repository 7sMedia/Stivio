import { Dropbox } from "dropbox";

export async function uploadToDropbox(file: File, folderPath: string) {
  const accessToken = localStorage.getItem("dropbox_access_token");
  if (!accessToken) throw new Error("Dropbox access token not found.");

  const dbx = new Dropbox({ accessToken, fetch });

  const arrayBuffer = await file.arrayBuffer();
  const dropboxPath = `${folderPath}/${file.name}`;

  const response = await dbx.filesUpload({
    path: dropboxPath,
    contents: arrayBuffer,
    mode: { ".tag": "add" },
    autorename: true,
  });

  const tempLinkRes = await dbx.filesGetTemporaryLink({ path: response.result.path_lower! });

  return {
    name: file.name,
    link: tempLinkRes.result.link,
    path: response.result.path_lower!,
  };
}
