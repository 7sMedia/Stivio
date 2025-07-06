export interface ImageFile {
  id: string;
  name: string;
  dropboxPath: string;
  modifiedName?: string;
  url: string;
}

export interface DropboxTokenData {
  accessToken: string;
  inputFolderPath: string;
  outputFolderPath: string;
}
