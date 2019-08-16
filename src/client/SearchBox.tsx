import * as React from 'react';
import { API_URL } from './constants';
import { formatFileData } from './helpers';

const { useState } = React;

interface SearchBoxProps {
  setIsSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  isSearchResults: boolean;
}

export default function SearchBox(props: SearchBoxProps) {
  const [searchText, setSearchText] = useState('');

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
          props.setIsSearchResults(true);
          const files = formatFileData(data.resources);
          props.setFileList(files);
          console.log(files);
        })
        .catch(err => console.error(err));
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (props.isSearchResults) {
      console.log('TODO: reset full list');
      props.setIsSearchResults(false);
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
