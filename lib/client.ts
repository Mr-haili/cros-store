import {
  RequestMsg,
  ResponseMsg,
  Method
} from './types';

// 通过映射使得操作跨域locaslstorage和操作本地的localstorage一样
export interface CrossStoreOptions {
  iframeURL: string, // 用于做共享区域的iframe的url地址
  expire: number // 过期时间
}

export class CrossStoreClient {
  private _options: CrossStoreOptions;
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
    // options: CrossStoreOptions
  ) {
    // TODO 
    // this._options = Object.assign({
    //   iframeUrl: '',
    //   expire: '30d'
    // }, options);

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

  private _postMessage(
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
    });
  }

  async set(key: string, val: any): Promise<string | null> {
    return this._tryPostMessage(Method.SET, [key, val]);
  }

  async get(key: string): Promise<string | null> {
    return this._tryPostMessage(Method.GET, [key]);
  }

  async remove(key: string): Promise<null> {
    return this._tryPostMessage(Method.REMOVE, [key]) as Promise<null>;
  }
}
