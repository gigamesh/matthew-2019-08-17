import { API_URL } from './constants.ts';
import { kbString, formatFileData } from './helpers.ts';

export const setFullList = ({ setTotalFileSize, setFileList, setIsSearchResults }) => {
  fetch(`${API_URL}/list`)
    .then(res => res.json())
    .then((data) => {
      const totalSize = data.resources.reduce((total, current) => total + current.bytes, 0);

      setTotalFileSize(kbString(totalSize));

      const files = formatFileData(data.resources);
      setFileList(files);

      // reset isSearchResults in case previous results were from searching
      setIsSearchResults(false);
    })
    .catch(err => console.error(err));
};
