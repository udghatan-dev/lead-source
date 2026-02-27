let DB_NAME = 'ab_chat';
let STORE_NAME = 'chat_media';

function openIndexedDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('media_id', 'id', { unique: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function deleteRecord(id) {
  const db = await openIndexedDatabase(DB_NAME, STORE_NAME);
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete(id);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(`Record with ID ${id} deleted`);
    transaction.onerror = () => reject('Error deleting record');
  });
}

async function saveDataInIndexedDB(data) {
  const db = await openIndexedDatabase(DB_NAME, STORE_NAME);
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put(data);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve('Data saved successfully');
    transaction.onerror = () => reject('Error saving data');
  });
}

async function getDataFromIndexDB(id) {
  const db = await openIndexedDatabase(DB_NAME, STORE_NAME);
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const index = store.index('media_id');
  const request = index.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error getting data');
  });
}

function deleteIndexedDatabase() {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

    deleteRequest.onsuccess = () => resolve('Database deleted successfully');
    deleteRequest.onerror = () => reject('Error deleting database');
    deleteRequest.onblocked = () => reject('Delete blocked. Please close all other tabs using the DB.');
  });
}

export { openIndexedDatabase, saveDataInIndexedDB, getDataFromIndexDB, deleteRecord, deleteIndexedDatabase };
