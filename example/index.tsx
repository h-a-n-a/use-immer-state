import * as React from 'react'
import { render } from 'react-dom'
import useImmerState from '../src'
const baseState = {
  fruits: ['apple', 'pear'],
  others: []
}
const App = () => {
  const [fruit, setFruit] = React.useState('')
  const [basket, updateBasket] = useImmerState(baseState)
  return (
    <>
      <div>
        fruits:
        <input
          value={fruit}
          onChange={(e) => {
            setFruit(e.target.value)
          }}
        />
        <button
          onClick={() => {
            updateBasket((draft) => {
              draft.fruits.push(fruit)
            })
            setFruit('')
          }}
        >
          添加
        </button>
      </div>
      <div>basket: {JSON.stringify(basket)}</div>
      <div>fruits: {String(basket.fruits)}</div>
      <div>are others equal: {String(baseState.others === basket.others)}</div>
    </>
  )
}

render(<App />, document.getElementById('root'))
