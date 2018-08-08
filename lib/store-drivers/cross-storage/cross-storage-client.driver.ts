import {
  RequestMsg,
  ResponseMsg,
  Method
} from './types';
import {
  AsyncStorageDriver
} from '../types';

/**
 * 现在这个模块的功能其实有2个
 * 1. 实现了一个及其受限的跨域通信职能
 * 2. 提供了一个比较粗糙，简略本地存储功能
 * 感觉这样也不是太好啊，或许我们能有更好的结构
 */
export class CrossStorageClientDriver implements AsyncStorageDriver{
  private _origin: string;

  // 服务端和客户端窗口
  private _serverWin: Window; // 用于做共享空间的窗口
  private _clientWin: Window; // 就是我们当前的窗口

  // 用于通信的回调标识
  private _cbId: number; // 用于标识一次通信
  private _cbRecord: { [cbId: number]: any };

  private _isConnected: boolean;
  private _iframeBeforeFuns: Function[];

  constructor(
    serverUrl: string
  ) {
    // supportCheck(); // 环境监测
    
    this._cbId = 0;
    this._cbRecord = { };

    // 在用于做共享存储对的iframe初始化以前，我们使用一个队列来延迟操作
    this._isConnected = false;
    this._iframeBeforeFuns = [];

    this._clientWin = window;
    this._clientWin.addEventListener('message', (evt: MessageEvent) => {
      this._onReceiveResponseMsg(evt);
    });
    this._createIframe(serverUrl);
  }

  private _getCbId(): number {
    return this._cbId += 1;
  }

  // 创建iframe获取contentWindow并建立通信
  private _createIframe(url: string) {
    const client = this;
    const iframe: HTMLIFrameElement = document.createElement('iframe');
    iframe.id = 'cros_iframe';
    iframe.style.cssText = 'width:1px;height:1px;border:0;position:absolute;left:-9999px;top:-9999px;';
    iframe.setAttribute('src', url);
    iframe.onload = () => {
      client._serverWin = iframe.contentWindow as any;
      client._isConnected = true;
      client._iframeBeforeFuns.forEach(func => func());
    }
    document.body.appendChild(iframe);
  }

  private _onReceiveResponseMsg(evt: MessageEvent) {
    const responseMsg: ResponseMsg = JSON.parse(evt.data);
    const { cbId, ret } = responseMsg;
    const { reject, resolve } = this._cbRecord[cbId];

    delete this._cbRecord[cbId];
    responseMsg.err ? reject(responseMsg.err) : resolve(responseMsg.ret);
  }

  private _tryPostMessage(
    method: Method,
    args: string[]
  ): Promise<string | null> {
    const client = this;
    return new Promise(resolve => {
      if (client._isConnected) {
        return client._postMessage(method, args).then(resolve);
      } else {
        client._iframeBeforeFuns.push(function() {
          client._postMessage(method, args).then(resolve);
        });
      }
    })
  }

  private async _postMessage(
    method: Method,
    args: string[]
  ): Promise<string | null> {
    const cbId = this._getCbId(); // 用户标识通信的UID
    const message: RequestMsg = {
      cbId,
      origin: '*',
      method,
      args: args
    }
    this._serverWin.postMessage(JSON.stringify(message), '*');
    return new Promise((resolve, reject) => {
      this._cbRecord[cbId] = { resolve, reject };
    }) as any;
  }

  get name(): string {
    return 'cross store client!';
  }

  async setItem(key: string, val: any): Promise<void> {
    const result = await this._tryPostMessage(Method.SET, [key, val]);
    return Promise.resolve();
  }

  async getItem(key: string): Promise<string | null> {
    return this._tryPostMessage(Method.GET, [key]);
  }

  async removeItem(key: string): Promise<null> {
    const result = await this._tryPostMessage(Method.REMOVE, [key]);
    return Promise.resolve(null);
  }
}
