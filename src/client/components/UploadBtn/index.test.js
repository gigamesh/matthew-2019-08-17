import React from 'react';
import mockAxios from 'axios';
import { render, fireEvent, cleanup } from '@testing-library/react';
import UploadBtn from './index.tsx';
import { API_URL } from '../../constants.ts';
import { mockFile } from '../../__mocks__/data';

const uploadBtnProps = {
  setFileList: () => {},
  windowWidth: 1000
};

afterEach(cleanup);

it('uploads file', () => {
  const mockFileObj = {
    target: {
      files: [mockFile]
    }
  };
  const data = new FormData();
  data.append('file', mockFile);

  const { getByRole } = render(<UploadBtn {...uploadBtnProps} />);

  const input = getByRole('File Input');

  fireEvent.change(input, mockFileObj);

  expect(mockAxios.post).toHaveBeenCalledWith(`${API_URL}/upload`, data);
});
