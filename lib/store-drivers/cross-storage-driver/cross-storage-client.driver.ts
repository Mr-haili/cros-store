import {
  RequestMsg,
  ResponseMsg,
  Method
} from './types';
import {
  AsyncStorageDriver
} from '../types';
import {
  generateUUID
} from './utils';

/**
 * 现在这个模块的功能其实有2个
 * 1. 实现了一个功能较为简陋的跨域通信职能
 * 2. 提供了一个比较粗糙简略的本地存储功能
 * 感觉这样也不是太好啊，或许我们能有更好的结构，将实现通信的模块拆分出去
 */
export class CrossStorageClientDriver implements AsyncStorageDriver{
  private _origin: string;

  // 服务端和客户端窗口
  private _serverWin: Window; // 用于做共享空间的窗口
  private _clientWin: Window; // 就是我们当前应用的窗口

  // 用于通信的回调标识
  private _cbRecord: { [cbId: string]: any };

  private _isConnected: boolean;
  private _iframeBeforeFuns: Function[];

  constructor() {
    // supportCheck(); // 环境监测
    this._cbRecord = { };

    // 在用于做共享存储对的iframe初始化以前，我们使用一个队列来延迟操作
    this._isConnected = false;
    this._iframeBeforeFuns = [];

    this._clientWin = window;
    this._clientWin.addEventListener('message', (evt: MessageEvent) => {
      this._onReceiveResponseMsg(evt);
    });
  }

  private _getCbId(): string {
    return generateUUID();
  }

  /**
   * 创建iframe获取contentWindow并建立通信
   * 将创建iframe的时机，暴露给用户
   */
  async createIframe(url: string): Promise<boolean> {
    if(this._serverWin) return true;
    const client = this;
    const iframe: HTMLIFrameElement = document.createElement('iframe');
    iframe.id = 'cros_iframe';
    iframe.style.cssText = 'width:1px;height:1px;border:0;position:absolute;left:-9999px;top:-9999px;';
    iframe.setAttribute('src', url);

    // TODO 有加载不成功的情况，需要处理
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      iframe.onload = () => {
        client._serverWin = iframe.contentWindow as any;
        client._isConnected = true;
        client._iframeBeforeFuns.forEach(func => func());
        resolve(true);
      }
    });
    document.body.appendChild(iframe);
    return promise;
  }

  /**
   * 只有接受到的信息的json对象，并且对应cbId是有效的，否则不响应这条信息
   */
  private _onReceiveResponseMsg(evt: MessageEvent): void {
    let responseMsg: ResponseMsg;
    try {
      responseMsg = JSON.parse(evt.data);
    } catch (error) {
      return;
    }
    const { cbId, ret, err } = responseMsg;
    if(!cbId || !this._cbRecord[cbId]) return;

    const { reject, resolve } = this._cbRecord[cbId];
    delete this._cbRecord[cbId];
    err ? reject(err) : resolve(ret);
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
    return 'crossStorageClient';
  }

  async setItem(key: string, val: any): Promise<void> {
    await this._tryPostMessage(Method.SET, [key, val]);
  }

  async getItem(key: string): Promise<string | null> {
    return this._tryPostMessage(Method.GET, [key]);
  }

  async removeItem(key: string): Promise<void> {
    await this._tryPostMessage(Method.REMOVE, [key]);
  }
}
