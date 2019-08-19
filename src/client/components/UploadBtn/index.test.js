import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { wait } from '@testing-library/dom';
import UploadBtn from './index.tsx';

const uploadBtnProps = {
  setFileList: () => {},
  windowWidth: 1000
};

afterEach(cleanup);

it('shows error message if file is larger than 10mb', () => {
  // const { getByText } = render(<UploadBtn {...uploadBtnProps} />);
});
