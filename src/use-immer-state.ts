import { useState, useRef } from 'react'
import { toProxy, INTERNAL_STATE } from './core'
import { BaseState, InternalState } from './types'
import { is } from './utils'

function useImmerState<T extends BaseState>(baseState: T): [T, T] {
  const [state, setState] = useState(baseState)
  const isUpdatingRef = useRef(false)

  const onBaseStateMutation = () => {
    if (isUpdatingRef.current) return
    isUpdatingRef.current = true
    Promise.resolve().then(() => {
      isUpdatingRef.current = false
      const internalState = draftRef.current[INTERNAL_STATE as any] as InternalState<T>
      const newState = internalState.draftedState
      setState(() => {
        return (is.array(newState) ? [...newState] : { ...newState }) as T
      })
    })
  }

  const draftRef = useRef(toProxy(baseState, onBaseStateMutation))
  return [state, draftRef.current]
}

export default useImmerState
