import Artist from './components/artist';
import Track from './components/track';
import DataSlicer from './components/dataSlicer';

export default class Main {
  static async main() {
    try {
      const artists = await DataSlicer.processCSV<Artist>('artists.csv', Artist.fromCSV);
      console.log(artists);

      const tracks = await DataSlicer.processCSV<Track>('tracks.csv', Track.fromCSV);
      console.log(tracks);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}