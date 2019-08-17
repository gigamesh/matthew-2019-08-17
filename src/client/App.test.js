import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import mockAxios from 'jest-mock-axios';
import { FetchMock } from '@react-mock/fetch';
import { render, fireEvent } from '@testing-library/react';
import { wait } from '@testing-library/dom';
import { API_URL, CLOUDINARY_DIR } from './constants.ts';
import App from './App.tsx';
import { rawImageList, formattedImageList, mockUploadedImg } from './__mocks__/data';

const renderComponent = mocks => render(
  <FetchMock mocks={mocks}>
    <App />
  </FetchMock>
);

it('renders list of images', async () => {
  const fetchMocks = [
    { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } }
  ];
  const { findByText } = renderComponent(fetchMocks);

  const img0 = await findByText(formattedImageList[0].name);
  const img1 = await findByText(formattedImageList[1].name);
  const img2 = await findByText(formattedImageList[2].name);

  [img0, img1, img2].forEach((img) => {
    expect(img).not.toBeUndefined();
  });
});

it('search box updates from keyboard input', async () => {
  const fetchMocks = [
    { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } }
  ];
  const { findByPlaceholderText } = renderComponent(fetchMocks);

  const searchInput = await findByPlaceholderText('Search documents...');
  fireEvent.change(searchInput, { target: { value: 'abc' } });

  expect(searchInput.value).toBe('abc');
});

// it('searches for an image', async () => {
//   const SEARCH_STRING = 'BETTER';
//   const fetchMocks = [
//     { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } },
//     {
//       matcher: `${API_URL}/search?=${SEARCH_STRING}`,
//       method: 'GET',
//       response: { resources: rawImageList[1] }
//     }
//   ];
//   const { findByPlaceholderText, findAllByText, findByText } = renderComponent(fetchMocks);

//   const searchInput = await findByPlaceholderText('Search documents...');
//   const searchBtn = await findByText('search');
//   searchInput.value = SEARCH_STRING;
//   fireEvent.click(searchBtn);

//   const deleteBtns = await findAllByText('Delete');

//   expect(deleteBtns).toHaveLength(1);
// });

// it('deletes image from list', async () => {
//   const fileName = formattedImageList[0].name;
//   const fetchMocks = [
//     { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } },
//     {
//       matcher: `${API_URL}/delete?publicId=${CLOUDINARY_DIR + fileName}`,
//       method: 'DELETE',
//       response: { resources: rawImageList.slice(1, 3) }
//     }
//   ];

//   const { findAllByText } = renderComponent(fetchMocks);

//   let deleteBtns = await findAllByText('Delete');

//   fireEvent.click(deleteBtns[0]);

//   // waits for FetchMock to complete before checking assertion
//   deleteBtns = await findAllByText('Delete');

//   expect(deleteBtns).toHaveLength(2);
// });

// it('uploads an image', async () => {
//   mockAxios.mockResponse({ resources: rawImageList.push(mockUploadedImg) });
//   const fetchMocks = [
//     { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } }
//   ];

//   const { getByAltText, getByLabelText } = renderComponent(fetchMocks);

//   const file = new File(['(⌐□_□)'], 'stevebrule.png', { type: 'image/png' });
//   const uploadBtn = getByLabelText('UPLOAD');

//   ReactTestUtils.Simulate.change(uploadBtn, { target: { files: [file] } });
//   const uploadedImg = await wait(() => getByAltText('stevebrule'));

//   expect(uploadedImg).not.toBeUndefined();
// });
