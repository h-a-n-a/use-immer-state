export const is = {
  object: (val: unknown): val is Object => Object.prototype.toString.call(val) === '[object Object]',
  array: (val: unknown): val is Array<any> => Array.isArray(val),
  function: (val: unknown): val is Function => typeof val === 'function',
  set: (val: unknown): val is Set<any> => Object.prototype.toString.call(val) === '[object Set]',
  map: (val: unknown): val is Set<any> => Object.prototype.toString.call(val) === '[object Map]'
}
