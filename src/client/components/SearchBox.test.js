import React from 'react';
import { FetchMock } from '@react-mock/fetch';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { wait } from '@testing-library/dom';
import { API_URL } from '../constants.ts';
import SearchBox from './SearchBox.tsx';
import { rawImageList, formattedImageList } from '../__mocks__/data';

afterEach(cleanup);

const renderComponent = (mocks, props) => render(
  <FetchMock mocks={mocks}>
    <SearchBox {...props} />
  </FetchMock>
);

it('search box updates from keyboard input', async (done) => {
  const fetchMocks = [
    { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } }
  ];
  const { findByPlaceholderText } = renderComponent(fetchMocks);

  const searchInput = await findByPlaceholderText('Search documents...');
  fireEvent.change(searchInput, { target: { value: 'abc' } });

  expect(searchInput.value).toBe('abc');
  done();
});

it('calls search function on button click', async (done) => {
  const SEARCH_STRING = formattedImageList[1].name;
  const fetchMocks = [
    { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } },
    {
      matcher: `${API_URL}/search?searchString="${SEARCH_STRING}"`,
      method: 'GET',
      response: { status: 200, resources: [rawImageList[1]] }
    }
  ];
  const searchBoxProps = {
    setIsSearchResults: () => {},
    setFileList: jest.fn(),
    setTotalFileSize: () => {},
    isSearchResults: false
  };
  const { findByRole, findByPlaceholderText } = renderComponent(fetchMocks, searchBoxProps);

  const searchInput = await findByPlaceholderText('Search documents...');
  fireEvent.change(searchInput, { target: { value: SEARCH_STRING } });

  const searchBtn = await findByRole('Search Button');
  fireEvent.click(searchBtn);

  await wait(() => expect(searchBoxProps.setFileList).toHaveBeenCalledWith([formattedImageList[1]]));
  done();
});
