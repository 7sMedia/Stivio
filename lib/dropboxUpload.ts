import { Dropbox } from "dropbox";

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN!; // Replace if you're passing token per user

export async function uploadToDropbox({
  file,
  path,
  accessToken = DROPBOX_ACCESS_TOKEN,
}: {
  file: File;
  path: string; // e.g. "/Beta7/input/filename.jpg"
  accessToken?: string;
}) {
  const dbx = new Dropbox({ accessToken });

  const arrayBuffer = await file.arrayBuffer();

  const dropboxPath = path.startsWith("/") ? path : `/${path}`;

  const response = await dbx.filesUpload({
    path: dropboxPath,
    mode: "add", // Avoid overwriting
    autorename: true,
    mute: true,
    strict_conflict: false,
    contents: arrayBuffer,
  });

  return {
    name: response.result.name,
    path: response.result.path_display,
    id: response.result.id,
    client_modified: response.result.client_modified,
  };
}
