import { formatFileData, getErrorIfFileInvalid } from './index.ts';
import { rawImageList, formattedImageList, mockFile } from '../__mocks__/data';

describe('formatFileData', () => {
  it('correctly formats data', () => {
    const files = formatFileData(rawImageList);

    expect(files).toEqual(formattedImageList);
  });
});

describe('getErrorIfFileInvalid', () => {
  it('returns error if file is over 10mb', () => {
    const file1 = { ...mockFile, size: 1e7 + 1 };

    const errorMsg1 = getErrorIfFileInvalid(file1);

    expect(errorMsg1).toBeTruthy();
  });

  it('returns no error if file is equal to or under 10mb', () => {
    const file1 = { ...mockFile, size: 1e7 };
    const file2 = { ...mockFile, size: 1e7 - 1 };

    const errorMsg1 = getErrorIfFileInvalid(file1);
    const errorMsg2 = getErrorIfFileInvalid(file2);

    expect(errorMsg1).toBeFalsy();
    expect(errorMsg2).toBeFalsy();
  });

  it("returns false if file isn't a jpg or png", () => {
    const file1 = { ...mockFile, type: 'image/gif' };
    const file2 = { ...mockFile, type: 'image/bmp' };
    const file3 = { ...mockFile, type: 'text/html' };

    const errorMsg1 = getErrorIfFileInvalid(file1);
    const errorMsg2 = getErrorIfFileInvalid(file2);
    const errorMsg3 = getErrorIfFileInvalid(file3);

    expect(errorMsg1).toBeTruthy();
    expect(errorMsg2).toBeTruthy();
    expect(errorMsg3).toBeTruthy();
  });

  it('returns true if file is a jpg or png', () => {
    const file1 = { ...mockFile, type: 'image/png' };
    const file2 = { ...mockFile, type: 'image/jpg' };

    const errorMsg1 = getErrorIfFileInvalid(file1);
    const errorMsg2 = getErrorIfFileInvalid(file2);

    expect(errorMsg1).toBeFalsy();
    expect(errorMsg2).toBeFalsy();
  });
});
