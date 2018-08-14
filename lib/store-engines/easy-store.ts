import {
  LocalStorageDriver,
  CrossStorageClientDriver,
  AsyncStorageDriver
} from 'store-drivers';
import {
  serialize,
  deserialize
} from './utils';

/**
 * 存储配置项，如果isCros为true则必须提供serverUrl
 */
export interface EasyStoreConfig {
  namespace: string
}

// 对底层的持久化存储做一些封装
// 我们把所有的值都存成JSON string
// TODO 我们需要一个插件机制来实现各种乱七八糟的功能
export class EasyStore {
  private readonly _namespacePrefix: string;
  protected readonly _storageDriver: AsyncStorageDriver;

  constructor(
    namespace: string,
    storageDriver: AsyncStorageDriver
  ) {
    this._namespacePrefix = namespace;
    this._storageDriver = storageDriver;
  }

  async write(key: string, val: any): Promise<void> {
    key = this._addNamespacePrefix(key);
    const serializedVal = serialize(val);
    await this._storageDriver.setItem(key, serializedVal);
  }

  async read(
    key: string,
    optionalDefaultValue: any
  ): Promise<any> {
    key = this._addNamespacePrefix(key);
    const serializedVal = await this._storageDriver.getItem(key);
    const val = deserialize(serializedVal);
    return val || optionalDefaultValue
  }

  async remove(key: string): Promise<void> {
    key = this._addNamespacePrefix(key);
    return this._storageDriver.removeItem(key);
  }

  private _addNamespacePrefix(key: string): string {
    return `${this._namespacePrefix }_${ key }`;
  }
}
