import { BaseState, InternalState, ValueType } from './types'
import { is } from './utils'

const INTERNAL_STATE: unique symbol = Symbol()

function produce<T extends BaseState>(baseState: T, draft: (draft: T) => void): T {
  const proxy = toProxy(baseState)
  draft(proxy)
  const baseInternalState = proxy[INTERNAL_STATE as any]
  return baseInternalState.mutated ? baseInternalState.draftedState : baseState
}

function toProxy<T extends BaseState>(baseState: T, invokeParentToCopy?: () => void): T {
  let internalState: InternalState<T>
  const { keyToProxy, originalState } = (internalState = {
    originalState: baseState as T,
    draftedState: is.array(baseState) ? ([...baseState] as T) : ({ ...baseState } as T),
    keyToProxy: {} as InternalState<T>['keyToProxy'],
    mutated: false
  })
  return new Proxy(baseState, {
    get(target, key: keyof T): ValueType<T> | InternalState<T> {
      if (key === INTERNAL_STATE) {
        return internalState
      }
      const value = target[key]
      if (is.object(value) || Array.isArray(value)) {
        return key in keyToProxy
          ? keyToProxy[key]!
          : (keyToProxy[key] = toProxy(value, invokeParentOnChildMutation))
      }
      return internalState.mutated ? internalState.draftedState[key] : originalState[key]

      function invokeParentOnChildMutation(): void {
        internalState.mutated = true
        const proxyOfChild: any = keyToProxy[key]
        // Get updated draftedState from child
        const { draftedState: childDraftedState } = proxyOfChild[INTERNAL_STATE]
        // Modify child value to key of child
        internalState.draftedState[key] = childDraftedState
        // Chain parent callbacks
        invokeParentToCopy && invokeParentToCopy()
      }
    },
    set(target, key, value): boolean {
      internalState.mutated = true
      copyTargetOnWrite(target, key, value, internalState)
      invokeParentToCopy && invokeParentToCopy()
      return true
    }
  })
}

function copyTargetOnWrite<T extends BaseState>(
  target: T,
  key: PropertyKey,
  value: any,
  internalState: InternalState<T>
): void {
  const { draftedState } = internalState
  for (const item in target) {
    draftedState[item] = item in draftedState ? draftedState[item] : target[item]
  }
  internalState.draftedState[key as keyof T] = value
}

export { produce }
