/**
 * 一个兼容性方法添加监听事件
 */
export function addEvent(
  evtName: string,
  listener: EventListener
): void {
  window.addEventListener(evtName, listener);
}
