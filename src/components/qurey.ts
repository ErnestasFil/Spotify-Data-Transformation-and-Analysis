import db from './database';

export default class Query {
  static async truncate(table: string) {
    try {
      await db(table).truncate();
      console.log(`Table ${table} truncated successfully.`);
    } catch (error) {
      console.error(`Error truncating table ${table}`);
      throw error;
    }
  }

  static async insert(table: string, data: any) {
    try {
      await db.batchInsert(table, data, 100);
      console.log(`Data inserted into table ${table} successfully.`);
    } catch (error) {
      console.error(`Error inserting data into table ${table}`);
      throw error;
    }
  }

  static async destroy() {
    try {
      await db.destroy();
      console.log(`Database connection closed successfully.`);
    } catch (error) {
      console.error(`Error closing database connection`);
      throw error;
    }
  }

  static async raw(query: string) {
    try {
      const results = await db.raw(query);
      console.log(`Query finished successfully.`);
      return results.rows;
    } catch (error) {
      console.error(`Error in execution of this query`);
      throw error;
    }
  }
}
