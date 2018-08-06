import {
  LocalStorageDriver
} from '../drivers';
import {
  AsyncStorageDriver
} from '../types';
import {
  serialize,
  deserialize
} from '../util';

// 对底层的持久化存储做一些封装
// 我们把所有的值都存成JSON string
export class Store {
  // TODO 我们需要一个插件机制来实现各种功能!

  constructor(
    private readonly _namespacePrefix: string = '',
    private readonly _storageDriver: AsyncStorageDriver
  ) { }

  async write(key: string, val: any): Promise<void> {
    key = this._addNamespacePrefix(key);
    const serializedVal = serialize(val);
    return await this._storageDriver.setItem(key, serializedVal);
  }

  async read(key: string, optionalDefaultValue: any = null): Promise<any> {
    key = this._addNamespacePrefix(key);
    const serializedVal = await this._storageDriver.getItem(key);
    const val = deserialize(serializedVal);
    return val || optionalDefaultValue
  }

  remove(key: string): void {
    key = this._addNamespacePrefix(key);
    this._storageDriver.removeItem(key);
  }

  private _addNamespacePrefix(key: string): string {
    return `${ this._namespacePrefix }_${ key }`;
  }
}
