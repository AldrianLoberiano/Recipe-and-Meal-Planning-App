import mysql, { type Pool, type PoolConnection, type RowDataPacket } from "mysql2/promise";

const mysqlUrl = process.env.MYSQL_URL;

if (!mysqlUrl) {
  throw new Error("Missing MYSQL_URL environment variable for MySQL connection.");
}

type GlobalWithMysqlPool = typeof globalThis & {
  __MEALCRAFT_MYSQL_POOL__?: Pool;
};

const globalForMysql = globalThis as GlobalWithMysqlPool;

// Reuse pool during hot reload in development.
export const mysqlDb =
  globalForMysql.__MEALCRAFT_MYSQL_POOL__ ??
  mysql.createPool({
    uri: mysqlUrl,
    connectionLimit: Number(process.env.MYSQL_POOL_LIMIT ?? 10),
    waitForConnections: true,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMysql.__MEALCRAFT_MYSQL_POOL__ = mysqlDb;
}

export async function mysqlQuery<T extends RowDataPacket[] = RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
): Promise<T> {
  const [rows] = await mysqlDb.query<T>(sql, params);
  return rows;
}

export async function withMysqlTransaction<T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await mysqlDb.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function closeMysqlDb(): Promise<void> {
  await mysqlDb.end();
}
