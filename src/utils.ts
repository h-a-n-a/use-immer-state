export const is = {
  object: (val: unknown): val is object =>
    Object.prototype.toString.call(val) === '[object Object]',
  array: (val: unknown): val is Array<any> => Array.isArray(val)
}
