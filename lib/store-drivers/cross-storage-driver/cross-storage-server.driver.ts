import {
  RequestMsg,
  ResponseMsg,
  Method
} from './types';
import {
  addEvent
} from './utils';

export class CrossStorageServerDriver {
  constructor(safeDomain?: string) {
    const me = this;
    addEvent('message', evt => me._onReceiveRequestMsg(evt as MessageEvent));
  }

  private _onReceiveRequestMsg(evt: MessageEvent): void {
    let requestMsg: RequestMsg;
    try {
      requestMsg = JSON.parse(evt.data);
    } catch (error) {
      return;
    }

    // TODO 域名有效性验证
    // const originHostName = new url(evt.origin).hostname;
    // const origin = evt.origin;

    const { method, cbId, args } = requestMsg;
    const [key, val] = args;
    
    let ret: string | null = null;
    switch(method) {
      case Method.GET:
        ret = this.get(key);
        break;
      case Method.SET:
        this.set(key, val);
        break;
      case Method.REMOVE:
        this.remove(key);
        break;
      case Method.CLEAR:
        this.clear();
        break;
      default:
        console.error(`不支持的Method，${method}`);
    }

    const responseMsg: ResponseMsg = { cbId, ret };

    // 处理后返回请求 source 和 window.top 感觉应该是恒等的
    window.top.postMessage(JSON.stringify(responseMsg), '*'); // 暂时都用*
  }

  // 操纵localStorage
  set(key: string, val: string): void {
    localStorage.setItem(key, val);
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
