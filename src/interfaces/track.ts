export interface ITrack {
  id: string;
  name: string;
  artists: string[];
  id_artists: string[];
  release_date: Date;
  popularity: number;
  energy: number;
  danceability: number;
}
