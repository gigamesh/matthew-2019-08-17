import { CLOUDINARY_DIR, ROOT_CLOUDINARY_URL, THUMBNAIL_SIZE } from './constants';

export const kbString = (bytes: number) => `${Math.round(((bytes / 1000) * 10) / 10).toLocaleString()} kb`;

type APIResults = Array<{
  public_id: string;
  format: string;
  bytes: number;
  version: number;
}>;

export const formatFileData = (apiResults: APIResults) => {
  if (apiResults.length) {
    return apiResults.map((file) => {
      const { public_id, format, bytes } = file;
      const newFile: FileType = {
        name: public_id.replace(CLOUDINARY_DIR, ''),
        size: kbString(bytes),
        thumbnail: `${`${ROOT_CLOUDINARY_URL + THUMBNAIL_SIZE}/v${
          file.version
        }/${public_id}.${format}`}`
      };
      return newFile;
    });
  } return [];
};
