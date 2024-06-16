import Artist from '../src/components/artist';
import { DataRow } from '../src/interfaces/datarow';
import IArtist from '../src/interfaces/artist';

const mockArtist: IArtist = {
  id: '1',
  name: 'Test Artist',
  followers: 1000,
};

const mockDataRow: DataRow = {
  id: '1',
  name: 'Test Artist',
  followers: '1000',
};

const mockDataRowNoFollowers: DataRow = {
  id: '1',
  name: 'Test Artist',
  followers: '',
};

test('Test constructor initializes properties correctly', () => {
  const artist = new Artist(mockArtist);

  expect(artist.id).toBe(mockArtist.id);
  expect(artist.name).toBe(mockArtist.name);
  expect(artist.followers).toBe(mockArtist.followers);
});

test('Test fromCSV creates an Artist instance from DataRow', () => {
  const artist = Artist.fromCSV(mockDataRow);

  expect(artist).toBeInstanceOf(Artist);
  expect(artist.id).toBe(mockDataRow.id);
  expect(artist.name).toBe(mockDataRow.name);
  expect(artist.followers).toBe(parseInt(mockDataRow.followers));
});

test('Test fromCSV handles missing followers field', () => {
  const artist = Artist.fromCSV(mockDataRowNoFollowers);

  expect(artist).toBeInstanceOf(Artist);
  expect(artist.id).toBe(mockDataRowNoFollowers.id);
  expect(artist.name).toBe(mockDataRowNoFollowers.name);
  expect(artist.followers).toBe(0);
});
