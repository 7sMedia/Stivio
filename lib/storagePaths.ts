// /lib/storagePaths.ts

import { v4 as uuidv4 } from "uuid";

export function generateOutputPath(filenamePrefix: string = "seedance_video"): {
  fullPath: string;
  filename: string;
  folder: string;
} {
  const uuid = uuidv4();
  const filename = `${filenamePrefix}_${uuid}.mp4`;
  const folder = "/Apps/Beta7/Outputs";
  return {
    fullPath: `${folder}/${filename}`,
    filename,
    folder,
  };
}
