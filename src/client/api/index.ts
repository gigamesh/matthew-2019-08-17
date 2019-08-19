import axios from 'axios';
import { API_URL } from '../constants';
import { formatFileData } from '../helpers';

export const setFullList = (setFileList: React.Dispatch<React.SetStateAction<FileType[]>>) => fetch(`${API_URL}/list`)
  .then(res => res.json())
  .then((data) => {
    const files = formatFileData(data.resources);
    setFileList(files);
    return files;
  })
  .catch(err => console.error(err));

export const uploadToServer = (data: FormData) => axios.post(`${API_URL}/upload`, data);
