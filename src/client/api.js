import { API_URL } from './constants.ts';
import { formatFileData } from './helpers.ts';

export const setFullList = setFileList => fetch(`${API_URL}/list`)
  .then(res => res.json())
  .then((data) => {
    const files = formatFileData(data.resources);
    setFileList(files);
    return files;
  })
  .catch(err => console.error(err));
