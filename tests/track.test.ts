import Track from '../src/components/track';
import { DataRow } from '../src/interfaces/datarow';

const mockDataRow: DataRow = {
  id: '1',
  name: 'Test Track',
  artists: "['Artist 1', 'Artist 2']",
  id_artists: "['123', '456']",
  duration_ms: '300000',
  release_date: '2023-06-16',
  popularity: '75',
  energy: '0.8',
  danceability: '1',
};

test('Test constructor initializes properties correctly', () => {
  const track = new Track({
    id: '1',
    name: 'Test Track',
    artists: ['Artist 1', 'Artist 2'],
    id_artists: ['123', '456'],
    duration_ms: 300000,
    year: 2023,
    month: 6,
    day: 16,
    popularity: 75,
    energy: 0.8,
    danceability: 'Medium',
  });

  expect(track.id).toBe('1');
  expect(track.name).toBe('Test Track');
  expect(track.artists).toEqual(['Artist 1', 'Artist 2']);
  expect(track.id_artists).toEqual(['123', '456']);
  expect(track.duration_ms).toBe(300000);
  expect(track.year).toBe(2023);
  expect(track.month).toBe(6);
  expect(track.day).toBe(16);
  expect(track.popularity).toBe(75);
  expect(track.energy).toBe(0.8);
  expect(track.danceability).toBe('Medium');
});

test('Test danceabilityValue to be Low', () => {
  const clonedTrack: DataRow = {
    ...mockDataRow,
  };

  clonedTrack.danceability = '0.35';
  const track = Track.fromCSV(clonedTrack);

  expect(track.danceability).toBe('Low');
});

test('Test danceabilityValue to be Medium', () => {
  const clonedTrack: DataRow = {
    ...mockDataRow,
  };

  clonedTrack.danceability = '0.55';
  const track = Track.fromCSV(clonedTrack);

  expect(track.danceability).toBe('Medium');
});

test('Test fromCSV creates a Track instance from DataRow', () => {
  const track = Track.fromCSV(mockDataRow);

  expect(track).toBeInstanceOf(Track);
  expect(track.id).toBe('1');
  expect(track.name).toBe('Test Track');
  expect(track.artists).toEqual(['Artist 1', 'Artist 2']);
  expect(track.id_artists).toEqual(['123', '456']);
  expect(track.duration_ms).toBe(300000);
  expect(track.year).toBe(2023);
  expect(track.month).toBe(6);
  expect(track.day).toBe(16);
  expect(track.popularity).toBe(75);
  expect(track.energy).toBe(0.8);
  expect(track.danceability).toBe('High');
});

test('Test fromCSV handles invalid or missing fields', () => {
  const invalidDataRow: DataRow = {
    id: '2',
    name: 'Invalid Track',
    artists: '',
    id_artists: '',
    duration_ms: '',
    release_date: '2023-06-16',
    popularity: '',
    energy: '',
    danceability: 'invalid',
  };

  const track = Track.fromCSV(invalidDataRow);

  expect(track).toBeInstanceOf(Track);
  expect(track.id).toBe('2');
  expect(track.name).toBe('Invalid Track');
  expect(track.artists).toEqual(['']);
  expect(track.id_artists).toEqual(['']);
  expect(track.duration_ms).toBe(0);
  expect(track.year).toBe(2023);
  expect(track.month).toBe(6);
  expect(track.day).toBe(16);
  expect(track.popularity).toBe(0);
  expect(track.energy).toBe(0);
  expect(track.danceability).toBe('Unexpected value');
});
