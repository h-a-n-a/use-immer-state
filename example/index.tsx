import * as React from 'react'
import { render } from 'react-dom'
import useImmerState from '../src'

const App = () => {
  const [fruit, setFruit] = React.useState('')
  const [country, setCountry] = React.useState('')
  const [bucket, updateBucket] = useImmerState({
    fruits: ['apple', 'pear'],
    countries: ['US', 'UK']
  })
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
            updateBucket((draft) => {
              draft.fruits.push(fruit)
            })
            setFruit('')
          }}
        >
          添加
        </button>
      </div>
      <div>
        countries:
        <input
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
          }}
        />
        <button
          onClick={() => {
            updateBucket((draft) => {
              draft.countries.push(country)
            })
            setCountry('')
          }}
        >
          添加
        </button>
      </div>
      <div>raw: {JSON.stringify(bucket)}</div>
      <div>fruits: {JSON.stringify(bucket.fruits)}</div>
      <div>countries: {JSON.stringify(bucket.countries)}</div>
    </>
  )
}

render(<App />, document.getElementById('root'))
