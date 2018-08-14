import {
  LocalStorageDriver
} from 'store-drivers';
import {
  EasyStore
} from './easy-store';

export class EasyLocalStore extends EasyStore{
  constructor(
    namespace: string
  ) {
    const storageDriver = new LocalStorageDriver();
    super(namespace, storageDriver);
  }
}
