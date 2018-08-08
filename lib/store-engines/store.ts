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
interface StoreConfig {
  namespace: string,
  isCros: boolean,
  serverUrl?: string
}

// 对底层的持久化存储做一些封装
// 我们把所有的值都存成JSON string
// TODO 我们需要一个插件机制来实现各种乱七八糟的功能
export class Store {
  private readonly _namespacePrefix: string;
  private readonly _isCros: boolean;
  private readonly _serverUrl: string | undefined;
  protected _storageDriver: AsyncStorageDriver;

  // 改改接口呗
  constructor(cfg: StoreConfig) {
    const { namespace, isCros, serverUrl } = cfg;
    this._namespacePrefix = namespace;
    this._isCros = isCros;
    this._serverUrl = serverUrl;

    if(isCros) {
      // 写这段代码的人，英语很烂就是这样
      if(!serverUrl) throw 'Store when open cros, must config serverUrl';
      this._storageDriver = new CrossStorageClientDriver(serverUrl);
    } else {
      this._storageDriver = new LocalStorageDriver();
    }
  }

  // // 异步的初始化
  // async connect(): Promise<boolean> {
  //   const [isCros, serverUrl] = [this._isCros, this._serverUrl];
  //   if(isCros) {
  //     if(!serverUrl) throw 'Store when open cros, must config serverUrl'; // 英语很烂
  //     this._storageDriver = new CrossStorageClientDriver(serverUrl);
  //   } else {
  //     this._storageDriver = new LocalStorageDriver();
  //   }
  //   return true;
  // }

  async write(key: string, val: any): Promise<void> {
    key = this._addNamespacePrefix(key);
    const serializedVal = serialize(val);
    await this._storageDriver.setItem(key, serializedVal);
  }

  async read(key: string, optionalDefaultValue: any = null): Promise<any> {
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
