import Artist from './components/artist';
import Track from './components/track';
import DataSlicer from './components/dataSlicer';
import S3Storage from './components/s3Storage';
import Query from './components/qurey';

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

    await Query.truncate('artists');
    await Query.truncate('tracks');

    await Query.insert('artists', artistsData);
    await Query.insert('tracks', tracksData);

    const queryData = await Query.raw(`
      WITH RankedTracks AS (
        SELECT
          T.id,
          T.name,
          T.popularity,
          T.energy,
          T.danceability,
          T.year,
          SUM(A.followers) as total_followers,
          ROW_NUMBER() OVER (PARTITION BY T.year ORDER BY T.energy DESC, SUM(A.followers) DESC) as rank
        FROM
          tracks as T,
          LATERAL unnest(T.id_artists) as artist_id
        JOIN
          artists as A ON artist_id = A.id
        GROUP BY
          T.id, T.name, T.popularity, T.energy, T.danceability, T.year
        HAVING
          SUM(A.followers) > 0
      )
      SELECT
        id,
        name,
        popularity,
        energy,
        danceability,
        year,
        total_followers
      FROM
        RankedTracks
      WHERE
        rank = 1
    `);

    await DataSlicer.saveJSON('results.json', queryData);
    await Query.destroy();
  }
}
