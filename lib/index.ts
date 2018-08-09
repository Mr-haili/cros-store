import 'promise-polyfill/src/polyfill';
import {
  CrossStorageClientDriver,
  CrossStorageServerDriver,
  LocalStorageDriver
} from 'store-drivers';
import {
  EasyLocalStore
} from 'store-engines';

export {
  CrossStorageClientDriver,
  CrossStorageServerDriver,
  LocalStorageDriver,
  EasyLocalStore
}

const win: any = window;
win.CrossStorageServerDriver = CrossStorageServerDriver;
// win.EasyLocalStore = EasyLocalStore;
