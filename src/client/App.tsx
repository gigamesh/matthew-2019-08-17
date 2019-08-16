import * as React from 'react';
import { API_URL, CLOUDINARY_DIR } from './constants';
import { kbString, formatFileData } from './helpers';
import ImageCard from './ImageCard';
import SearchBox from './SearchBox';
import './app.scss';

const { useState, useEffect } = React;

export default function App() {
  const [fileList, setFileList] = useState([]);
  const [totalFileSize, setTotalFileSize] = useState('');
  const [isSearchResults, setIsSearchResults] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/list`)
      .then(res => res.json())
      .then((data) => {
        const totalSize = data.resources.reduce(
          (total: number, current: { bytes: number }) => total + current.bytes,
          0
        );

        setTotalFileSize(kbString(totalSize));

        const files = formatFileData(data.resources);
        setFileList(files);

        // reset isSearchResults in case previous results were from searching
        setIsSearchResults(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (filename: string) => {
    const publicId = CLOUDINARY_DIR + filename;
    fetch(`${API_URL}/delete?publicId=${publicId}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .then((data) => {
        const files = formatFileData(data.resources);
        setFileList(files);
      });
  };

  return (
    <main>
      <SearchBox
        setIsSearchResults={setIsSearchResults}
        isSearchResults={isSearchResults}
        setFileList={setFileList}
      />
      <h1 className="gridHeader">
        <span>
          {fileList.length}
          {' '}
Documents
        </span>
        <span>
          Total size:
          {totalFileSize}
        </span>
      </h1>

      <div className="cardGrid">
        {fileList.map(file => (
          <ImageCard key={file.name} file={file} handleDelete={handleDelete} />
        ))}
      </div>
    </main>
  );
}
