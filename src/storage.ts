export type BookRow={id:string;title:string;author:string;version:string;file:Blob;added:number};
const db=()=>new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('sakura-reader-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('books',{keyPath:'id'});r.result.createObjectStore('progress',{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
async function action<T>(store:string,mode:IDBTransactionMode,fn:(s:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,mode),r=fn(t.objectStore(store));r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);t.oncomplete=()=>d.close();t.onerror=()=>reject(t.error)})}
export const getBooks=()=>action<BookRow[]>('books','readonly',s=>s.getAll());
export const putBook=(b:BookRow)=>action<IDBValidKey>('books','readwrite',s=>s.put(b));
export const getPosition=async(id:string)=>(await action<{id:string,cfi:string}|undefined>('progress','readonly',s=>s.get(id)))?.cfi;
export const putPosition=(id:string,cfi:string)=>action<IDBValidKey>('progress','readwrite',s=>s.put({id,cfi}));
export const deleteBook=async(id:string)=>{await action('books','readwrite',s=>s.delete(id));await action('progress','readwrite',s=>s.delete(id))};
