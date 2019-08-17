import * as React from 'react';
import { API_URL, CLOUDINARY_DIR } from './constants';
import { formatFileData } from './helpers';
import ImageCard from './ImageCard';
import SearchBox from './SearchBox';
import { setFullList } from './api';
import './styles/main.scss';

const { useState, useEffect } = React;

function App() {
  const [fileList, setFileList] = useState([] as FileType[]);
  const [totalFileSize, setTotalFileSize] = useState('');
  const [isSearchResults, setIsSearchResults] = useState(false);

  useEffect(() => {
    setFullList({ setTotalFileSize, setFileList, setIsSearchResults });
  }, []);

  const handleDelete = (filename: string) => {
    const publicId = CLOUDINARY_DIR + filename;
    fetch(`${API_URL}/delete?publicId=${publicId}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .then((data) => {
        const files: FileType[] = formatFileData(data.resources);
        setFileList(files);
      });
  };

  return (
    <main>
      <SearchBox
        setTotalFileSize={setTotalFileSize}
        setIsSearchResults={setIsSearchResults}
        isSearchResults={isSearchResults}
        setFileList={setFileList}
      />
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
  );
}

export default App;
