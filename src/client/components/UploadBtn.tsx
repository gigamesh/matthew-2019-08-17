import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { toastOptions, API_URL, BREAKPOINT_SM } from '../constants';
import { formatFileData } from '../helpers';

const { useState } = React;

interface UploadBtnProps {
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  windowWidth: number;
}

function UploadBtn(props: UploadBtnProps) {
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState('UPLOAD');
  const { setFileList, windowWidth } = props;

  const handleUpload = (event: React.ChangeEvent<any>) => {
    const file = event.target.files[0];
    const invalidFileError = validateFile(file);

    if (invalidFileError) {
      toast.error(invalidFileError, toastOptions as any);
    } else {
      const data = new FormData();
      data.append('file', file);

      setLoading(true);
      setBtnText('UPLOADING...');

      axios
        .post(`${API_URL}/upload`, data)
        .then((res) => {
          toast.success('Image uploaded! 🤙', toastOptions as any);
          const files = formatFileData(res.data.resources);
          setFileList(files);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
          setBtnText('UPLOAD');
        });
    }
  };

  const validateFile = (file: { size: number; type: string }) => {
    let error = '';
    if (file.size > 1e7) {
      error = 'File must be less than 10mb';
    }
    if (!/(jpeg|jpg|png)/.test(file.type)) {
      error = 'File must be a JPG or PNG';
    }
    return error;
  };

  return (
    <div className="uploadBtnWrap">
      {windowWidth > BREAKPOINT_SM ? <Loader visible={loading} /> : null}
      <label className="uploadButton" htmlFor="uploadInput">
        {btnText}
      </label>
      <input
        accept="image/*"
        className="uploadInput"
        type="file"
        name="uploadInput"
        id="uploadInput"
        onChange={handleUpload}
      />
    </div>
  );
}

export default UploadBtn;
