import { Dropbox } from "dropbox";

export async function renameDropboxFile(
  accessToken: string,
  fromPath: string,
  toPath: string
) {
  const dbx = new Dropbox({ accessToken });

  try {
    const response = await dbx.filesMoveV2({
      from_path: fromPath,
      to_path: toPath,
      autorename: false,
    });

    return response.result.metadata;
  } catch (error) {
    console.error("Error renaming Dropbox file:", error);
    throw error;
  }
}
