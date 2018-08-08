import {
  CrossStorageClientDriver,
  CrossStorageServerDriver,
  LocalStorageDriver
} from './store-drivers';
import {
  Store
} from './store-engines';

const win = window as any;
win.CrossStorageClientDriver = CrossStorageClientDriver;
win.CrossStorageServerDriver = CrossStorageServerDriver;
win.Store = Store;

export {
  CrossStorageClientDriver,
  CrossStorageServerDriver,
  LocalStorageDriver,
  Store
}
