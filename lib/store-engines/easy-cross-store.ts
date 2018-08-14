import {
  CrossStorageClientDriver
} from 'store-drivers';
import {
  EasyStore
} from './easy-store';

/**
 * 多了一个connect方法用来连接
 */
export class EasyCrossStore extends EasyStore {
  protected _storageDriver: CrossStorageClientDriver;

  constructor(namespace: string) {
    const storageDriver = new CrossStorageClientDriver();
    super(namespace, storageDriver);
  }

  async connect(serverUrl: string): Promise<boolean> {
    const storageDriver = this._storageDriver;
    return storageDriver.createIframe(serverUrl);
  }
}
