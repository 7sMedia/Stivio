import { Dropbox } from "dropbox";

export async function deleteDropboxFile(accessToken: string, filePath: string) {
  const dbx = new Dropbox({ accessToken });

  try {
    const response = await dbx.filesDeleteV2({ path: filePath });
    return response.result.metadata;
  } catch (error) {
    console.error("Error deleting Dropbox file:", error);
    throw error;
  }
}
