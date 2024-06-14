import csv from 'csv-parser';
import fs from 'fs';

import { DataRow } from '../interfaces/datarow';

export default class DataSlicer {
  static parseArrayFromCSV(stringArray: string): string[] {
    const array = stringArray.replace(/'/g, '').slice(1, -1).split(',');
    return array.map((element) => element.trim());
  }

  static async processCSV<T>(filename: string, fromCSV: (row: DataRow) => T): Promise<T[]> {
    const data: T[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(process.env.DATA_FOLDER + filename)
        .pipe(csv())
        .on('data', (row: DataRow) => {
          const item = fromCSV(row);
          data.push(item);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    return data;
  }
}
