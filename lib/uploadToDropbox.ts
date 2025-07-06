import { Dropbox } from "dropbox";

export async function uploadToDropbox({
  file,
  folderPath,
}: {
  file: File;
  folderPath: string;
}) {
  const accessToken = localStorage.getItem("dropbox_access_token");
  if (!accessToken) {
    throw new Error("Dropbox not authenticated.");
  }

  const dbx = new Dropbox({ accessToken, fetch });

  const fileName = file.name;
  const dropboxPath = `${folderPath}/${fileName}`;

  const fileBuffer = await file.arrayBuffer();

  const uploadResult = await dbx.filesUpload({
    path: dropboxPath,
    contents: fileBuffer,
    mode: { ".tag": "add" },
    autorename: true,
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
}
