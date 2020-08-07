import { BaseState, InternalState, ValueType } from './types'
import { is } from './utils'
const INTERNAL_STATE: unique symbol = Symbol()

function produce<T extends BaseState>(baseState: T, producer: (draft: T) => void): T {
  const proxy = toProxy(baseState)
  producer(proxy)
  const baseInternalState = proxy[INTERNAL_STATE]!
  return baseInternalState.mutated ? baseInternalState.draftedState : baseState
}

function toProxy<T extends BaseState>(
  baseState: T,
  invokeParentToCopy?: () => void,
  onBaseStateMutation?: () => void
): T & { [INTERNAL_STATE]?: InternalState<T> } {
  let internalState: InternalState<T>
  const { keyToProxy, originalState } = (internalState = {
    originalState: baseState,
    draftedState: createDraftStateFromOriginalState(),
    keyToProxy: {} as InternalState<T>['keyToProxy'],
    mutated: false
  })
  return new Proxy(baseState, {
    get(target, key: keyof T | typeof INTERNAL_STATE): ValueType<T> | InternalState<T> {
      if (key === INTERNAL_STATE) {
        return internalState
      }
      const value = target[key]
      if (is.object(value) || is.array(value) || is.map(value) || is.set(value)) {
        return key in keyToProxy ? keyToProxy[key]! : (keyToProxy[key] = toProxy(value, invokeParentOnChildMutation))
      } else if (is.function(value)) {
        // Cater for add, set, ...etc of Set, Map
        internalState.mutated = true
        invokeParentToCopy?.()
        return (value as Function).bind(internalState.draftedState)
      }
      return internalState.mutated ? internalState.draftedState[key] : originalState[key]
      function invokeParentOnChildMutation(): void {
        internalState.mutated = true
        const proxyOfChild: any = keyToProxy[key as keyof T]
        // Get updated draftedState from child
        const { draftedState: childDraftedState } = proxyOfChild[INTERNAL_STATE]
        // Modify child value to key of child
        internalState.draftedState[key as keyof T] = childDraftedState
        // Chain parent callbacks
        invokeParentToCopy?.()
        // Trigger on base-state mutations detected
        onBaseStateMutation?.()
      }
    },
    set(target, key: keyof T, value: ValueType<T>): boolean {
      internalState.mutated = true
      copyTargetOnWrite(target, key, value, internalState)
      invokeParentToCopy?.()
      return true
    }
  })
  function createDraftStateFromOriginalState(): T {
    if (is.array(baseState)) {
      return [...baseState] as T
    } else if (is.object(baseState)) {
      return { ...baseState } as T
    } else if (is.map(baseState)) {
      return new Map(baseState) as T
    } else if (is.set(baseState)) {
      return new Set(baseState) as T
    }
    return {} as T
  }
}

function copyTargetOnWrite<T extends BaseState>(
  target: T,
  key: keyof T,
  value: ValueType<T>,
  internalState: InternalState<T>
): void {
  const { draftedState } = internalState
  for (const item in target) {
    draftedState[item] = item in draftedState ? draftedState[item] : target[item]
  }
  internalState.draftedState[key as keyof T] = value
}

export { produce, toProxy, INTERNAL_STATE }
