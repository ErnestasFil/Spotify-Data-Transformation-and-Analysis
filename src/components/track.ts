import { DataRow } from '../interfaces/datarow';
import { ITrack } from '../interfaces/track';
import DataSlicer from './dataSlicer';

export default class Track implements ITrack {
  id: string;
  name: string;
  artists: string[];
  id_artists: string[];
  duration_ms: number;
  year: number;
  month: number;
  day: number;
  popularity: number;
  energy: number;
  danceability: string;

  constructor(track: ITrack) {
    this.id = track.id;
    this.name = track.name;
    this.artists = track.artists;
    this.id_artists = track.id_artists;
    this.duration_ms = track.duration_ms;
    this.year = track.year;
    this.month = track.month;
    this.day = track.day;
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
      duration_ms: row.duration_ms ? parseInt(row.duration_ms) : 0,
      year: new Date(row.release_date).getFullYear(),
      month: new Date(row.release_date).getMonth() + 1,
      day: new Date(row.release_date).getDate(),
      popularity: row.popularity ? parseInt(row.popularity) : 0,
      energy: row.energy ? parseFloat(row.energy) : 0,
      danceability: Track.danceabilityValue(parseFloat(row.danceability)),
    });
  }

  private static danceabilityValue: (value: number) => string = (value) => {
    if (value >= 0 && value < 0.5) {
      return 'Low';
    } else if (value >= 0.5 && value <= 0.6) {
      return 'Medium';
    } else if (value > 0.6 && value <= 1) {
      return 'High';
    } else {
      return 'Unexpected value';
    }
  };
}
