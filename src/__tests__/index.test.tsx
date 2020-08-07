import * as React from 'react'
import * as testing from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import useImmerState, { produce } from '../'

test('produce', () => {
  const baseState = {
    fruits: ['pear'],
    otherStuff: []
  }

  const nothingChanged = produce(baseState, (draft) => {})
  const result = produce(baseState, (draft) => {
    draft.fruits.push('apple')
  })

  expect(baseState === nothingChanged).toBeTruthy()
  expect(result.fruits).toEqual(['pear', 'apple'])
  expect(baseState.otherStuff === result.otherStuff).toBeTruthy()

  const complexBaseState = {
    fruits: [
      {
        name: 'pear',
        desc: 'juicy'
      },
      {
        name: 'apple',
        desc: 'sweet'
      }
    ],
    otherStuff: {
      cardNumber: new Set<number>(),
      map: new Map<string, any>()
    }
  }

  const complexResult = produce(complexBaseState, (draft) => {
    draft.otherStuff.cardNumber.add(123456)
    draft.otherStuff.cardNumber.add(234567)
    draft.otherStuff.map.set('name', 'h-a-n-a')
    draft.otherStuff.map.set('age', 18)
  })
  expect(complexBaseState.fruits === complexResult.fruits).toBeTruthy()
  expect(complexResult.otherStuff.cardNumber.has(123456)).toBeTruthy()
  expect(complexResult.otherStuff.cardNumber.has(234567)).toBeTruthy()
  expect(complexResult.otherStuff.map.get('name')).toBe('h-a-n-a')
  expect(complexResult.otherStuff.map.get('age')).toBe(18)
  expect(complexBaseState.otherStuff.map.has('name')).toBeFalsy()
  expect(complexBaseState.otherStuff.map.has('age')).toBeFalsy()

  const ultraComplexBaseState = {
    user: new Map<string, any>([
      [
        'h-a-n-a',
        {
          name: 'h-a-n-a',
          detail: {
            addr: 'addr'
          }
        }
      ]
    ]),
    id: new Set()
  }
  const ultraComplexButNothingChanged = produce(ultraComplexBaseState, () => {})
  expect(ultraComplexBaseState === ultraComplexButNothingChanged).toBeTruthy()
  const ultraComplexResult = produce(ultraComplexBaseState, (draft) => {
    draft.user.set('test', 'test')
  })
  expect(ultraComplexBaseState === ultraComplexResult).toBeFalsy()
  expect(ultraComplexResult.user.get('test')).toBe('test')
  expect(ultraComplexBaseState.user.has('test')).toBeFalsy()
})

test('useImmerState', async () => {
  const baseState = {
    fruits: ['apple', 'pear'],
    others: []
  }
  const App = () => {
    const [basket, updateBasket] = useImmerState(baseState)
    return (
      <>
        <div>
          fruits:
          <button
            onClick={() => {
              updateBasket((draft) => {
                draft.fruits.push('orange')
              })
            }}
          >
            Add
          </button>
        </div>
        <span data-testid="basket">{JSON.stringify(basket)}</span>
        <span data-testid="fruits">{String(basket.fruits)}</span>
        <span data-testid="equal">{String(baseState.others === basket.others)}</span>
      </>
    )
  }
  const { container, asFragment } = testing.render(<App />)
  expect(asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(container, 'Add'))
  await testing.waitForDomChange()
  expect(asFragment()).toMatchSnapshot()
  expect(testing.getByTestId(container, 'basket')).toHaveTextContent(
    JSON.stringify({
      fruits: ['apple', 'pear', 'orange'],
      others: []
    })
  )
  expect(testing.getByTestId(container, 'fruits')).toHaveTextContent(String(['apple', 'pear', 'orange']))
})
