import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

export default class S3Storage {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
    });
  }

  async uploadFile(key: string, fileContent: string) {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined in environment variables');
    }

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
    };

    try {
      const result = await this.s3.upload(params).promise();
      console.log(`File uploaded successfully. ${result.Location}`);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async getList() {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined in environment variables');
    }

    try {
      const response = await this.s3
        .listObjectsV2({
          Bucket: bucketName,
        })
        .promise();

      return response.Contents;
    } catch (error) {
      console.error('Error listing objects:', error);
      throw error;
    }
  }

  async downloadFile(key: string, downloadPath: string) {
    const bucketName = process.env.S3_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined in environment variables');
    }

    try {
      const response = await this.s3
        .getObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();

      fs.writeFileSync(downloadPath, response.Body as Buffer);
      console.log(`File downloaded successfully: ${key}`);
    } catch (error) {
      console.error(`Error downloading file ${key}:`, error);
      throw error;
    }
  }

  async downloadAllFiles() {
    const objects = await this.getList();
    const directory = process.env.FILTERED_DATA_FOLDER;

    if (!directory) {
      throw new Error('FILTERED_DATA_FOLDER is not defined in environment variables');
    }

    if (!objects) {
      console.log('No objects found in the bucket');
      return;
    }

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    for (const obj of objects) {
      if (obj.Key) {
        const downloadPath = path.join(directory, obj.Key);
        await this.downloadFile(obj.Key, downloadPath);
      }
    }
  }
}
