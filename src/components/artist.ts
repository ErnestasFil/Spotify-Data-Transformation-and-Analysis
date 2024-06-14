import IArtist from "../interfaces/artist";
import { DataRow } from "../interfaces/datarow";

export default class Artist implements IArtist {
  id: string;
  name: string;
  followers: number;

  constructor(artist: IArtist) {
    this.id = artist.id;
    this.name = artist.name;
    this.followers = artist.followers;
  }

  static fromCSV(row: DataRow): Artist {
    return new Artist({
      id: row.id,
      name: row.name,
      followers: parseInt(row.followers),
    });
  }
}
