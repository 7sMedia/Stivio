import { Dropbox } from "dropbox";

export async function deleteDropboxFile(accessToken: string, path: string) {
  const dbx = new Dropbox({ accessToken });

  try {
    await dbx.filesDeleteV2({ path });
    return true;
  } catch (error) {
    console.error("Error deleting Dropbox file:", error);
    throw error;
  }
}
