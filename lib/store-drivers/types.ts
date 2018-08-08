// 提供一个一致性的持久化存储的基础接口
export interface AsyncStorageDriver {
  readonly name: string;
  readonly getItem: (key: string) => Promise<string | null>;
  readonly setItem: (key: string, val: string) => Promise<void>;
  readonly removeItem: (key: string) => Promise<any>;
  // readonly dangerouslyClear: () => Promise<void>; // 这个考虑放到其他地方吧
}
