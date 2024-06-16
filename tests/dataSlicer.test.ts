import fs from 'fs';
import DataSlicer from '../src/components/dataSlicer';
import { DataRow } from '../src/interfaces/datarow';
import Artist from '../src/components/artist';
import Track from '../src/components/track';

jest.mock('fs');

const mockTrack: Track[] = [
  {
    id: '1',
    name: '',
    duration_ms: 1000,
    artists: ['artist'],
    id_artists: ['1'],
    year: 2020,
    month: 10,
    day: 10,
    popularity: 20,
    energy: 0.64,
    danceability: 'Low',
  },
  {
    id: '2',
    name: 'Name',
    duration_ms: 60001,
    artists: ['artist', 'artist2'],
    id_artists: ['1', '2'],
    year: 2020,
    month: 10,
    day: 10,
    popularity: 20,
    energy: 0.64,
    danceability: 'Low',
  },
  {
    id: '3',
    name: 'Name2',
    duration_ms: 60001,
    artists: ['artist4', 'artist2'],
    id_artists: ['20', '2'],
    year: 2020,
    month: 10,
    day: 10,
    popularity: 20,
    energy: 0.64,
    danceability: 'Low',
  },
];

describe('DataSlicer with mocked env', () => {
  beforeAll(() => {
    process.env.DATA_FOLDER = './data';
    process.env.FILTERED_DATA_FOLDER = './filtered_data';
    process.env.RESULTS_FOLDER = './results';
    process.env.TRACK_NAME_LENGHT = '0';
    process.env.TRACK_MIN_LENGHT = '1';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Test parseArrayFromCSV should parse CSV string into array', () => {
    const csvString = "['item1', 'item2', 'item3']";
    const result = DataSlicer.parseArrayFromCSV(csvString);
    expect(result).toEqual(['item1', 'item2', 'item3']);
  });

  test('Test processCSV should process CSV data correctly', async () => {
    const mockData = [
      { id: '1', name: 'Test1' },
      { id: '2', name: 'Test2' },
    ];
    const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();

    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (this: any, event, callback) {
        if (event === 'data') {
          mockData.forEach((row) => callback(row));
        }
        if (event === 'end') {
          callback();
        }
        if (event === 'error') {
          callback(new Error('Mock error'));
        }
        return this;
      }),
    };

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

    const fromCSV = (row: DataRow) => row as any;
    const result = await DataSlicer.processCSV('test.csv', fromCSV);
    expect(result).toEqual(mockData);
    expect(consoleErrorSpy).toHaveBeenCalledWith('File test.csv was successfully read');

    consoleErrorSpy.mockRestore();
  });

  test('Test processJSON should process JSON data correctly', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockJsonData = [
      { id: '1', name: 'Test1' },
      { id: '2', name: 'Test2' },
    ];
    const mockJsonString = JSON.stringify(mockJsonData);

    fs.readFileSync = jest.fn().mockReturnValue(mockJsonString);

    const result = await DataSlicer.processJSON('test.json');
    expect(result).toEqual(mockJsonData);
    expect(consoleErrorSpy).toHaveBeenCalledWith('File test.json was successfully read');

    consoleErrorSpy.mockRestore();
  });

  test('saveJSON should save JSON data correctly', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockJsonData = [
      { id: '1', name: 'Test1' },
      { id: '2', name: 'Test2' },
    ];
    const mockJsonString = JSON.stringify(mockJsonData, null, 2);

    fs.writeFileSync = jest.fn();

    await DataSlicer.saveJSON('test.json', mockJsonData);
    expect(fs.writeFileSync).toHaveBeenCalledWith('./results/test.json', mockJsonString, 'utf-8');
    expect(consoleErrorSpy).toHaveBeenCalledWith('File test.json was successfully created');

    consoleErrorSpy.mockRestore();
  });

  test('Test filterTracks should filter tracks correctly', () => {
    const result = DataSlicer.filterTracks(mockTrack);
    expect(result).toEqual([mockTrack[1], mockTrack[2]]);
  });

  test('Test filterArtists should filter artists correctly', () => {
    const artists: Artist[] = [
      { id: '1', name: 'artist', followers: 15 },
      { id: '15', name: 'Artist2', followers: 20 },
      { id: '2', name: 'artist2', followers: 2 },
    ];

    const result = DataSlicer.filterArtists(mockTrack, artists);
    expect(result).toEqual([artists[0], artists[2]]);
  });
});
