import csv from 'csv-parser';
import fs from 'fs';

import { DataRow } from '../interfaces/datarow';
import Artist from './artist';
import Track from './track';

export default class DataSlicer {
  static parseArrayFromCSV(stringArray: string): string[] {
    const array = stringArray.replace(/'/g, '').slice(1, -1).split(',');
    return array.map((element) => element.trim());
  }

  static async processCSV<T>(filename: string, fromCSV: (row: DataRow) => T): Promise<T[]> {
    const data: T[] = [];
    const directory = process.env.DATA_FOLDER;

    if (!directory) {
      throw new Error('DATA_FOLDER is not defined in environment variables');
    }

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(directory + '/' + filename)
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
          throw error;
        });
    });

    console.log(`File ${filename} was successfully read`);
    return data;
  }

  static async processJSON(filename: string): Promise<any[]> {
    try {
      const directory = process.env.FILTERED_DATA_FOLDER;

      if (!directory) {
        throw new Error('FILTERED_DATA_FOLDER is not defined in environment variables');
      }

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const fileContent = fs.readFileSync(directory + '/' + filename, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading or parsing JSON file');
      throw error;
    }
  }

  static async saveJSON(filename: string, data: any) {
    try {
      const directory = process.env.RESULTS_FOLDER;

      if (!directory) {
        throw new Error('RESULTS_FOLDER is not defined in environment variables');
      }

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const jsonContent = JSON.stringify(data, null, 2);
      fs.writeFileSync(directory + '/' + filename, jsonContent, 'utf-8');
      console.log(`File ${filename} was successfully created`);
    } catch (error) {
      console.error('Error creating JSON file');
      console.log(error);
    }
  }

  static filterTracks(data: Track[]): Track[] {
    return data.filter(
      (track) =>
        track.name.length > Number(process.env.TRACK_NAME_LENGHT || 0) &&
        track.duration_ms >= Number(process.env.TRACK_MIN_LENGHT || 1) * 60000,
    );
  }

  static filterArtists(tracks: Track[], artists: Artist[]): Artist[] {
    const uniqueArtistIds = tracks.reduce<Set<string>>((acc, track) => {
      track.id_artists.forEach((id) => acc.add(id));
      return acc;
    }, new Set<string>());
    return artists.filter((artist) => uniqueArtistIds.has(artist.id));
  }
}
