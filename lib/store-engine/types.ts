// 提供一个一致性的持久化存储接口
// export interface IStorageHandle {
//   readonly name: string;
//   readonly read: (key: string) => any;
//   readonly write: (key: string, data: any) => any;
//   // readonly each: (fn: Function) => void; // TODO 暂时不做
//   readonly remove: (key: string) => any;
//   readonly clearAll: () => void;
// }

export interface AsyncStorageDriver {
  readonly name: string;
  readonly getItem: (key: string) => Promise<string | null>;
  readonly setItem: (key: string, val: string) => Promise<void>;
  readonly removeItem: (key: string) => Promise<any>;
  // readonly dangerouslyClear: () => Promise<void>; // 这个考虑放到其他地方吧
}
