export interface IndexedDbConfig {
  dbName: string;
  version: number;
  storeName: string;
}

const defaultConfig: IndexedDbConfig = {
  dbName: "meal_planner_db",
  version: 1,
  storeName: "app_data",
};

export function openIndexedDb(config: Partial<IndexedDbConfig> = {}): Promise<IDBDatabase> {
  const finalConfig: IndexedDbConfig = { ...defaultConfig, ...config };

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(finalConfig.dbName, finalConfig.version);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(finalConfig.storeName)) {
        db.createObjectStore(finalConfig.storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
}

export async function putRecord<T extends { id: string }>(
  record: T,
  config: Partial<IndexedDbConfig> = {}
): Promise<void> {
  const db = await openIndexedDb(config);

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction((config.storeName ?? defaultConfig.storeName), "readwrite");
    const store = tx.objectStore(config.storeName ?? defaultConfig.storeName);
    store.put(record);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to save record"));
  });

  db.close();
}

export async function getRecord<T>(
  id: string,
  config: Partial<IndexedDbConfig> = {}
): Promise<T | null> {
  const db = await openIndexedDb(config);

  const result = await new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction((config.storeName ?? defaultConfig.storeName), "readonly");
    const store = tx.objectStore(config.storeName ?? defaultConfig.storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("Failed to load record"));
  });

  db.close();
  return result;
}

export async function deleteRecord(
  id: string,
  config: Partial<IndexedDbConfig> = {}
): Promise<void> {
  const db = await openIndexedDb(config);

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction((config.storeName ?? defaultConfig.storeName), "readwrite");
    const store = tx.objectStore(config.storeName ?? defaultConfig.storeName);
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to delete record"));
  });

  db.close();
}

export async function listRecords<T>(
  config: Partial<IndexedDbConfig> = {}
): Promise<T[]> {
  const db = await openIndexedDb(config);

  const result = await new Promise<T[]>((resolve, reject) => {
    const tx = db.transaction((config.storeName ?? defaultConfig.storeName), "readonly");
    const store = tx.objectStore(config.storeName ?? defaultConfig.storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result as T[] | undefined) ?? []);
    request.onerror = () => reject(request.error ?? new Error("Failed to list records"));
  });

  db.close();
  return result;
}
