import React from 'react';
// import ReactTestUtils from 'react-dom/test-utils';
// import mockAxios from 'jest-mock-axios';
import { FetchMock } from '@react-mock/fetch';
import {
  render,
  fireEvent,
  cleanup
  // waitForElement
} from '@testing-library/react';
import { wait } from '@testing-library/dom';
import { API_URL, CLOUDINARY_DIR } from './constants.ts';
import App from './App.tsx';
import {
  rawImageList,
  formattedImageList
  // mockUploadedImg
} from './__mocks__/data';

afterEach(cleanup);

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
    expect(img).toBeTruthy();
  });
});

it('deletes image from list', async (done) => {
  const fileName = formattedImageList[0].name;
  const fetchMocks = [
    { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } },
    {
      matcher: `${API_URL}/delete?publicId=${CLOUDINARY_DIR + fileName}`,
      method: 'DELETE',
      response: { resources: rawImageList.slice(1, 3) }
    }
  ];

  const { findAllByText, getAllByRole } = renderComponent(fetchMocks);

  const deleteBtns = await findAllByText('Delete');

  fireEvent.click(deleteBtns[0]);

  // waits for FetchMock to complete before checking assertion
  await wait(() => expect(getAllByRole('Image Card')).toHaveLength(2));
  done();
});

// it('uploads an image', async () => {
//   // mockAxios.mockResponse({ resources: [...rawImageList, mockUploadedImg] });
//   const fetchMocks = [
//     { matcher: `${API_URL}/list`, method: 'GET', response: { resources: rawImageList } }
//   ];

//   const { getByAltText, getByLabelText } = renderComponent(fetchMocks);

//   const file = new File(['(⌐□_□)'], 'stevebrule.png', { type: 'image/png' });
//   const uploadBtn = getByLabelText('UPLOAD');

//   ReactTestUtils.Simulate.change(uploadBtn, { target: { files: [file] } });
//   const uploadedImg = await waitForElement(() => getByAltText('stevebrule'));

//   expect(uploadedImg).toBeTruthy();
// });
