import * as React from 'react';
import { toast } from 'react-toastify';
import { API_URL, toastOptions } from '../constants';
import { setFullList } from '../api';
import { formatFileData } from '../helpers';

const { useState } = React;

interface SearchBoxProps {
  setIsSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalFileSize: React.Dispatch<React.SetStateAction<string>>;
  isSearchResults: boolean;
}

export default function SearchBox(props: SearchBoxProps) {
  const [searchText, setSearchText] = useState('');
  const { setIsSearchResults, setFileList, isSearchResults } = props;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    console.log('searching!', searchText);
    if (!searchText) {
      toast.error('You forgot to enter search text 😉', toastOptions as any);
    } else {
      fetch(`${API_URL}/search?searchString="${searchText}"`)
        .then((res) => {
          if (res.status !== 200) {
            toastOptions.onClose = () => setSearchText('');
            toast.error('No images found 😪', toastOptions as any);
          }
          return res.json();
        })
        .then((data) => {
          if (!data.resources) return;

          setIsSearchResults(true);
          const files = formatFileData(data.resources);
          setFileList(files);
        })
        .catch(err => console.error(err));
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // if input is empty and the search results are currently displayed, fetch full list of images
    if (!event.currentTarget.value && isSearchResults) {
      setFullList(setFileList);
      setIsSearchResults(false);
    }
    setSearchText(event.currentTarget.value);
  };

  return (
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
  );
}
