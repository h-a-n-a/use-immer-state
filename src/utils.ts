export const is = {
  object: (val: unknown): val is Object =>
    Object.prototype.toString.call(val) === '[object Object]',
  array: (val: unknown): val is Array<any> => Array.isArray(val)
}
