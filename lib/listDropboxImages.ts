import { Dropbox } from "dropbox";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export async function listDropboxImages(accessToken: string, inputFolderPath: string) {
  const dbx = new Dropbox({ accessToken });

  try {
    const response = await dbx.filesListFolder({ path: inputFolderPath });

    const imageFiles = response.result.entries.filter((entry) => {
      if (entry[".tag"] !== "file") return false;
      const ext = entry.name.toLowerCase().slice(entry.name.lastIndexOf("."));
      return IMAGE_EXTENSIONS.includes(ext);
    });

    return imageFiles.map((file) => ({
      name: file.name,
      path: file.path_display,
      id: file.id,
      client_modified: file.client_modified,
      server_modified: file.server_modified,
      size: file.size,
    }));
  } catch (error) {
    console.error("Error listing Dropbox images:", error);
    return [];
  }
}
