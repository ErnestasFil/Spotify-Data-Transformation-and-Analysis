import Query from '../src/components/query';
import db from '../src/components/database';

describe('Query', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('Test truncates the table successfully', async () => {
    const tableName = 'test_table';

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await Query.truncate(tableName);

    expect(consoleLogSpy).toHaveBeenCalledWith(`Table ${tableName} truncated successfully.`);
    consoleLogSpy.mockRestore();
  });

  test('Test truncate when table not exist', async () => {
    const tableName = 'test_tables';

    const consoleLogSpy = jest.spyOn(console, 'error').mockImplementation();

    await Query.truncate(tableName);

    expect(consoleLogSpy).toHaveBeenCalledWith(`Error truncating table ${tableName}`);
    consoleLogSpy.mockRestore();
  });

  test('Test insert data into the table successfully', async () => {
    const tableName = 'test_table';
    const data = [{ name: 'Test Name 1' }, { name: 'Test Name 2' }];

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await Query.insert(tableName, data);

    const insertedData = await db(tableName).select('*');
    expect(insertedData).toHaveLength(2);
    expect(insertedData[0].name).toBe('Test Name 1');
    expect(insertedData[1].name).toBe('Test Name 2');

    expect(consoleLogSpy).toHaveBeenCalledWith(`Data inserted into table ${tableName} successfully.`);
    consoleLogSpy.mockRestore();
  });

  test('Test insert when inserting data into a non-existent table', async () => {
    const tableName = 'test_tables';
    const data = [{ name: 'Test Name 1' }];

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await Query.insert(tableName, data);

    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error inserting data into table ${tableName}`);
    consoleErrorSpy.mockRestore();
  });

  test('Test raw query successfully', async () => {
    await db.batchInsert('test_table', [{ name: 'Test Name 1' }, { name: 'Test Name 2' }], 100);
    const query = 'SELECT * FROM test_table';

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const results = await Query.raw(query);

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Test Name 1');
    expect(results[1].name).toBe('Test Name 2');

    expect(consoleLogSpy).toHaveBeenCalledWith('Query finished successfully.');
    consoleLogSpy.mockRestore();
  });

  test('Test raw method when query fails', async () => {
    const query = 'SELECT * FROM test_tables';

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await Query.raw(query);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in execution of this query');
    consoleErrorSpy.mockRestore();
  });

  test('Test raw query successfully', async () => {
    await db.batchInsert('test_table', [{ name: 'Test Name 1' }, { name: 'Test Name 2' }], 100);
    const query = 'SELECT * FROM test_table';

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const results = await Query.raw(query);

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Test Name 1');
    expect(results[1].name).toBe('Test Name 2');

    expect(consoleLogSpy).toHaveBeenCalledWith('Query finished successfully.');
    consoleLogSpy.mockRestore();
  });
});

test('Test database destroy method', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();

  await Query.destroy();

  expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection closed successfully.');

  consoleErrorSpy.mockRestore();
});
