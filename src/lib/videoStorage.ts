const DB_NAME = "nba-vault-media";
const DB_VERSION = 1;
const STORE = "blobs";
const VIDEO_KEY = "showcase-video";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export async function saveVideoBlob(blob: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(blob, VIDEO_KEY);
  });
}

export async function getVideoBlob(): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).get(VIDEO_KEY);
    r.onsuccess = () => {
      db.close();
      resolve(r.result ?? null);
    };
    r.onerror = () => reject(r.error);
  });
}

export async function deleteVideoBlob(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).delete(VIDEO_KEY);
  });
}

export const VIDEO_URL_STORAGE_KEY = "nba-vault-video-url";
