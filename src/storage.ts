export type BookRow={id:string;title:string;author:string;version:string;file:Blob;added:number};
const DB_NAME='sakura-reader-v1'; // Origin-scoped IndexedDB: no server uploads, no account identity.
let opened:Promise<IDBDatabase>|undefined;
function db():Promise<IDBDatabase>{if(!opened)opened=new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('books'))r.result.createObjectStore('books',{keyPath:'id'});if(!r.result.objectStoreNames.contains('progress'))r.result.createObjectStore('progress',{keyPath:'id'})};r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();opened=undefined};resolve(r.result)};r.onerror=()=>reject(r.error)}).catch(e=>{opened=undefined;throw e});return opened!}
async function action<T>(store:string,mode:IDBTransactionMode,fn:(s:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,mode),r=fn(t.objectStore(store));r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);t.onabort=()=>reject(t.error||new Error('IndexedDB transaction aborted'))})}
export const getBooks=()=>action<BookRow[]>('books','readonly',s=>s.getAll());
export const putBook=(b:BookRow)=>action<IDBValidKey>('books','readwrite',s=>s.put(b));
export const getPosition=async(id:string)=>(await action<{id:string,cfi:string}|undefined>('progress','readonly',s=>s.get(id)))?.cfi;
export const putPosition=(id:string,cfi:string)=>action<IDBValidKey>('progress','readwrite',s=>s.put({id,cfi}));
export const deleteBook=async(id:string)=>{await action('books','readwrite',s=>s.delete(id));await action('progress','readwrite',s=>s.delete(id))};
export async function requestPersistentStorage(){return navigator.storage?.persist?.()??false}
