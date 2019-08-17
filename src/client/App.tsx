import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL, CLOUDINARY_DIR, toastOptions } from './constants';
import { formatFileData, kbString } from './helpers';
import ImageCard from './components/ImageCard';
import SearchBox from './components/SearchBox';
import UploadBtn from './components/UploadBtn';
import { setFullList } from './api';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.scss';

const { useState, useEffect } = React;

function App() {
  const [fileList, setFileList] = useState([] as FileType[]);
  const [totalFileSize, setTotalFileSize] = useState('');
  const [isSearchResults, setIsSearchResults] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  window.onresize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    setFullList(setFileList);
  }, []);

  useEffect(() => {
    const totalSize = fileList.reduce(
      (total: number, current: { size: number }) => total + current.size,
      0
    );
    setTotalFileSize(kbString(totalSize));
  }, [fileList.length]);

  const handleDelete = (filename: string) => {
    const publicId = CLOUDINARY_DIR + filename;
    fetch(`${API_URL}/delete?publicId=${publicId}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .then((data) => {
        const files: FileType[] = formatFileData(data.resources);
        setFileList(files);
        toast.success('Image deleted! 🤙', toastOptions as any);
      });
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <main>
        <div className="topHeader">
          <SearchBox
            setTotalFileSize={setTotalFileSize}
            setIsSearchResults={setIsSearchResults}
            isSearchResults={isSearchResults}
            setFileList={setFileList}
          />
          <UploadBtn setFileList={setFileList} windowWidth={windowWidth} />
        </div>
        <h1 className="gridHeader">
          <span>{`${fileList.length} Documents`}</span>
          <span>{`Total: ${totalFileSize}`}</span>
        </h1>

        <div className="cardGrid">
          {fileList.map(file => (
            <ImageCard key={file.name} file={file} handleDelete={handleDelete} />
          ))}
        </div>
      </main>
    </React.Fragment>
  );
}

export default App;
