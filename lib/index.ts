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

(window as any).CrossStorageServerDriver = CrossStorageServerDriver;
