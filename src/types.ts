export type BaseState = Array<any> | Record<PropertyKey, any> | Map<any, any> | Set<any>
export interface InternalState<T extends BaseState> {
  originalState: T
  draftedState: T
  keyToProxy: Partial<T>
  mutated: boolean
}
export type ValueType<T> = T[keyof T]
