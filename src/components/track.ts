import { DataRow } from '../interfaces/datarow';
import { ITrack } from '../interfaces/track';
import DataSlicer from './dataSlicer';

export default class Track implements ITrack {
  id: string;
  name: string;
  artists: string[];
  id_artists: string[];
  release_date: Date;
  popularity: number;
  energy: number;
  danceability: number;

  constructor(track: ITrack) {
    this.id = track.id;
    this.name = track.name;
    this.artists = track.artists;
    this.id_artists = track.id_artists;
    this.release_date = track.release_date;
    this.popularity = track.popularity;
    this.energy = track.energy;
    this.danceability = track.danceability;
  }

  static fromCSV(row: DataRow): Track {
    return new Track({
      id: row.id,
      name: row.name,
      artists: DataSlicer.parseArrayFromCSV(row.artists),
      id_artists: DataSlicer.parseArrayFromCSV(row.id_artists),
      release_date: new Date(row.release_date),
      popularity: parseInt(row.popularity),
      energy: parseFloat(row.energy),
      danceability: parseFloat(row.danceability),
    });
  }
}
