/**
 * 一个兼容性方法添加监听事件
 */
export function addEvent(
  evtName: string,
  listener: EventListener
): void {
  window.addEventListener(evtName, listener);
}

// 检查环境的支持程度
// supportCheck(); 依赖检测
function supportCheck() {

}

/**
 * UUID v4 generation, taken from: http://stackoverflow.com/questions/
 * 105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
 *
 * @returns {string} A UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};
