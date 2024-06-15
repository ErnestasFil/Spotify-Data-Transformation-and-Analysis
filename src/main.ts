import Artist from './components/artist';
import Track from './components/track';
import DataSlicer from './components/dataSlicer';

export default class Main {
  static async main() {

    const tracks = await DataSlicer.processCSV<Track>('tracks.csv', Track.fromCSV);
    const filteredTracks = DataSlicer.filterTracks(tracks);

    const artists = await DataSlicer.processCSV<Artist>('artists.csv', Artist.fromCSV);
    const filteredArtists = DataSlicer.filterArtists(filteredTracks, artists);

  }
}
