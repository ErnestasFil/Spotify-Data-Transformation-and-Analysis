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

  static filterTracks(data: Track[]): Track[] {
    return data.filter((track) => track.name.length > Number(process.env.TRACK_NAME_LENGHT) && track.duration_ms >= Number(process.env.TRACK_MIN_LENGHT) * 60000);
  }

  static filterArtists(tracks: Track[], artists: Artist[]): Artist[] {
    const uniqueArtistIds = tracks.reduce<Set<string>>((acc, track) => {
      track.id_artists.forEach((id) => acc.add(id));
      return acc;
    }, new Set<string>());
    return artists.filter((artist) => uniqueArtistIds.has(artist.id));
  }
}
