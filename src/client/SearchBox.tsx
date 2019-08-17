import * as React from 'react';
import { API_URL } from './constants';
import { setFullList } from './api';
import { formatFileData } from './helpers';

const { useState } = React;

interface SearchBoxProps {
  setIsSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalFileSize: React.Dispatch<React.SetStateAction<string>>;
  isSearchResults: boolean;
}

export default function SearchBox(props: SearchBoxProps) {
  const [searchText, setSearchText] = useState('');
  const {
    setIsSearchResults, setFileList, setTotalFileSize, isSearchResults
  } = props;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchText) {
      console.log('TO DO!');
    } else {
      fetch(`${API_URL}/search?searchString="${searchText}"`)
        .then((res) => {
          if (res.status !== 200) throw new Error();
          return res.json();
        })
        .then((data) => {
          setIsSearchResults(true);
          const files = formatFileData(data.resources);
          setFileList(files);
          setTotalFileSize(files[0].size);
        })
        .catch(err => console.error(err));
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // if input is empty and the search results are currently displayed, fetch full list of images
    if (!event.currentTarget.value && isSearchResults) {
      setFullList({ setTotalFileSize, setFileList, setIsSearchResults });
      setIsSearchResults(false);
    }
    setSearchText(event.currentTarget.value);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="searchBoxWrapper">
        <input
          className="searchBox"
          placeholder="Search documents..."
          value={searchText}
          onChange={handleChange}
        />
        <button type="submit" className="searchIcon">
          <i className="material-icons">search</i>
        </button>
      </form>
    </div>
  );
}
