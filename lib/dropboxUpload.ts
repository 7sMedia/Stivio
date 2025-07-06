import { Dropbox } from "dropbox";

/**
 * Uploads a file to Dropbox.
 * @param accessToken Dropbox OAuth token
 * @param folderPath Path in Dropbox to upload to (e.g. "/MyFolder")
 * @param file File to upload (from <input> or drag-drop)
 * @param newFileName Optional override for the file name
 */
export async function uploadToDropbox(
  accessToken: string,
  folderPath: string,
  file: File,
  newFileName?: string
): Promise<{ path: string; name: string }> {
  const dbx = new Dropbox({ accessToken, fetch });

  const fileName = newFileName || file.name;
  const dropboxPath = `${folderPath}/${fileName}`;

  const fileBuffer = await file.arrayBuffer();

  const response = await dbx.filesUpload({
    path: dropboxPath,
    contents: fileBuffer,
    mode: { ".tag": "overwrite" },
    mute: true,
  });

  return {
    path: response.result.path_display || dropboxPath,
    name: fileName,
  };
}
