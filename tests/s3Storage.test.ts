import S3Storage from '../src/components/s3Storage';
import fs from 'fs';

beforeEach(() => {
  process.env.S3_BUCKET_NAME = 'test';
  process.env.FILTERED_DATA_FOLDER = 'folder';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('File upload', () => {
  test('Test file upload to S3 bucket', async () => {
    const s3Storage = new S3Storage();
    const mockUpload = jest
      .fn()
      .mockReturnValue({ promise: jest.fn().mockResolvedValue({ Location: 'mockLocation' }) });
    s3Storage['s3'].upload = mockUpload;

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const key = 'test-key';
    const fileContent = 'mock file content';

    await s3Storage.uploadFile(key, fileContent);

    expect(mockUpload).toHaveBeenCalledWith({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(`File uploaded successfully. mockLocation`);

    consoleLogSpy.mockRestore();
  });

  test('Test file upload to S3 bucket without bucket name', async () => {
    delete process.env.S3_BUCKET_NAME;
    const s3Storage = new S3Storage();

    const key = 'test-key';
    const fileContent = 'mock file content';

    await expect(s3Storage.uploadFile(key, fileContent)).rejects.toThrow(
      'S3_BUCKET_NAME is not defined in environment variables',
    );
  });

  test('Test file upload to S3 bucket with error while uploading', async () => {
    const s3Storage = new S3Storage();
    const mockUpload = jest
      .fn()
      .mockReturnValue({ rejects: jest.fn().mockResolvedValue({ Location: 'mockLocation' }) });
    s3Storage['s3'].upload = mockUpload;

    const consoleLogSpy = jest.spyOn(console, 'error').mockImplementation();

    const key = 'test-key';
    const fileContent = 'mock file content';

    await expect(s3Storage.uploadFile(key, fileContent)).rejects.toThrow();

    expect(consoleLogSpy).toHaveBeenCalledWith(`Error uploading file`);

    consoleLogSpy.mockRestore();
  });
});

describe('Get file list', () => {
  test('Test get file list from S3 bucket', async () => {
    const s3Storage = new S3Storage();
    const mockList = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Contents: [
          { Key: 'file1.txt', Size: 1024 },
          { Key: 'file2.txt', Size: 2048 },
        ],
      }),
    });
    s3Storage['s3'].listObjectsV2 = mockList;

    const result = await s3Storage.getList();

    expect(result).toEqual([
      { Key: 'file1.txt', Size: 1024 },
      { Key: 'file2.txt', Size: 2048 },
    ]);
  });

  test('Test get file list from S3 bucket without bucket name', async () => {
    delete process.env.S3_BUCKET_NAME;
    const s3Storage = new S3Storage();

    await expect(s3Storage.getList()).rejects.toThrow(
      'S3_BUCKET_NAME is not defined in environment variables',
    );
  });

  test('Test get file list from S3 bucket with error while getting data', async () => {
    const s3Storage = new S3Storage();
    const consoleLogSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(s3Storage.getList()).rejects.toThrow();
    expect(consoleLogSpy).toHaveBeenCalledWith(`Error listing objects`);

    consoleLogSpy.mockRestore();
  });
});

describe('Download file', () => {
  test('Test file download from S3 bucket', async () => {
    const s3Storage = new S3Storage();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const key = 'test-file.txt';
    const downloadPath = '/mock/download/path/test-file.txt';

    const mockGetObject = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Body: Buffer.from('mock file content'),
        Key: key,
      }),
    });

    s3Storage['s3'].getObject = mockGetObject;

    const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    await s3Storage.downloadFile(key, downloadPath);

    expect(consoleLogSpy).toHaveBeenCalledWith(`File downloaded successfully: ${key}`);
    expect(mockWriteFileSync).toHaveBeenCalledWith(downloadPath, Buffer.from('mock file content'));

    consoleLogSpy.mockRestore();
  });

  test('Test file download from S3 bucket without bucket name', async () => {
    delete process.env.S3_BUCKET_NAME;
    const key = 'test-file.txt';
    const downloadPath = '/mock/download/path/test-file.txt';
    const s3Storage = new S3Storage();

    await expect(s3Storage.downloadFile(key, downloadPath)).rejects.toThrow(
      'S3_BUCKET_NAME is not defined in environment variables',
    );
  });

  test('Test file download from S3 bucket with error while downloading', async () => {
    const s3Storage = new S3Storage();
    const key = 'test-file.txt';
    const downloadPath = '/mock/download/path/test-file.txt';
    const consoleLogSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(s3Storage.downloadFile(key, downloadPath)).rejects.toThrow();
    expect(consoleLogSpy).toHaveBeenCalledWith(`Error downloading file ${key}`);

    consoleLogSpy.mockRestore();
  });
});

describe('Download all files', () => {
  test('Test all file download from S3 bucket', async () => {
    const s3Storage = new S3Storage();

    const mockList = jest.fn().mockResolvedValue([
      { Key: 'file1.txt', Size: 1024 },
      { Key: 'file2.txt', Size: 2048 },
    ]);
    s3Storage.getList = mockList;

    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false).mockReturnValue(true);
    const mockMkdirSync = jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
    const mockDownloadFile = jest.spyOn(s3Storage, 'downloadFile').mockResolvedValue();

    await s3Storage.downloadAllFiles();

    expect(mockList).toHaveBeenCalled();
    expect(mockExistsSync).toHaveBeenCalledWith(process.env.FILTERED_DATA_FOLDER);
    expect(mockMkdirSync).toHaveBeenCalledWith(process.env.FILTERED_DATA_FOLDER, { recursive: true });
    expect(mockDownloadFile).toHaveBeenCalledTimes(2);
  });

  test('Test all file download from S3 bucket without directory name', async () => {
    delete process.env.FILTERED_DATA_FOLDER;
    const s3Storage = new S3Storage();
    const mockList = jest.fn().mockResolvedValue([
      { Key: 'file1.txt', Size: 1024 },
      { Key: 'file2.txt', Size: 2048 },
    ]);
    s3Storage.getList = mockList;

    await expect(s3Storage.downloadAllFiles()).rejects.toThrow(
      'FILTERED_DATA_FOLDER is not defined in environment variables',
    );
  });
});
