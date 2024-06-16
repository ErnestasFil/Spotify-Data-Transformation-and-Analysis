import Artist from './components/artist';
import Track from './components/track';
import DataSlicer from './components/dataSlicer';
import S3Storage from './components/s3Storage';
import db from './components/database';


export default class Main {
  static async main() {
    const tracks = await DataSlicer.processCSV<Track>('tracks.csv', Track.fromCSV);
    const filteredTracks = DataSlicer.filterTracks(tracks);

    const artists = await DataSlicer.processCSV<Artist>('artists.csv', Artist.fromCSV);
    const filteredArtists = DataSlicer.filterArtists(filteredTracks, artists);

    const filteredTracksJson = JSON.stringify(filteredTracks, null, 2);
    const filteredArtistsJson = JSON.stringify(filteredArtists, null, 2);

    const S3 = new S3Storage();

    await S3.uploadFile('filtered_tracks.json', filteredTracksJson);
    await S3.uploadFile('filtered_artists.json', filteredArtistsJson);

    await S3.downloadAllFiles()

    const tracksData = await DataSlicer.processJSON('filtered_tracks.json');
    const artistsData = await DataSlicer.processJSON('filtered_artists.json');

    await db('artists').truncate();
    await db('tracks').truncate();

    await db.batchInsert('artists', artistsData, 100);
    await db.batchInsert('tracks', tracksData, 100);

    db.destroy();
  }
}
