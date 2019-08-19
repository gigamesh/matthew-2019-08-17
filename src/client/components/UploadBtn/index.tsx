import React from 'react';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { toastOptions, BREAKPOINT_SM } from '../../constants';
import { formatFileData, getErrorIfFileInvalid } from '../../helpers';
import { uploadToServer } from '../../api';

const { useState } = React;

interface UploadBtnProps {
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  windowWidth: number;
}

function UploadBtn(props: UploadBtnProps) {
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState('UPLOAD');
  const { setFileList, windowWidth } = props;

  const handleUpload = async (event: React.ChangeEvent<any>) => {
    const file = event.target.files[0];
    const invalidFileError = getErrorIfFileInvalid(file);

    if (invalidFileError) {
      toast.error(invalidFileError, toastOptions as any);
    } else {
      const data = new FormData();
      data.append('file', file);

      setLoading(true);
      setBtnText('UPLOADING...');

      try {
        const serverResponse = await uploadToServer(data);
        toast.success('Image uploaded! 🤙', toastOptions as any);
        const files = formatFileData(serverResponse.data.resources);
        setFileList(files);
      } catch (error) {
        toast.error('Something went wrong 😢', toastOptions as any);
      }
      setLoading(false);
      setBtnText('UPLOAD');
    }
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
        role="File Input"
        onChange={handleUpload}
      />
    </div>
  );
}

export default UploadBtn;
