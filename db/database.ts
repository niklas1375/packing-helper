import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from "kysely";
import SQLite from 'better-sqlite3'
import { Database } from "../types/db/types";

const dialect = new SqliteDialect({
  database: new SQLite(process.env.DATABASE_URL),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()]
});
