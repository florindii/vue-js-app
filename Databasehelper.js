import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const DatabaseHelper = {
  async createTable(tableName, columns) {
    await CapacitorSQLite.execute(
      `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`
    );
  },
};

export default DatabaseHelper;
