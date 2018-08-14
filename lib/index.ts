import 'promise-polyfill/src/polyfill';
import {
  AsyncStorageDriver,
  CrossStorageClientDriver,
  CrossStorageServerDriver,
  LocalStorageDriver
} from 'store-drivers';
import {
  EasyCrossStore,
  EasyLocalStore
} from 'store-engines';

export {
  AsyncStorageDriver,  
  CrossStorageClientDriver,
  CrossStorageServerDriver,
  LocalStorageDriver,
  EasyCrossStore,
  EasyLocalStore  
}

const win: any = window;
win.CrossStorageServerDriver = CrossStorageServerDriver;
win.EasyLocalStore = EasyLocalStore;
