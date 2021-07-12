# use-immer-state

> 编写对象，由繁入简

## 特性
- 完整、轻量级实现 Immer 核心
- React 响应式驱动
- TypeScript 支持

## 在线体验

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/use-immer-state-demo-wh6dm)

## 安装

```bash
npm install use-immer-state --save
```

## 极速上手

配合 React Hooks 使用：

```tsx
import useImmerState from 'use-immer-state'

function App() {
  const [basket, updateBasket] = useImmerState({
    fruits: ['apple', 'pear']
  })
  const addOrange = () => updateBasket((draft) => {
    draft.fruits.push('orange')
  })
  return (
    <>
      <span>fruits: {String(basket.fruits)}</span>
      <button onClick={addOrange}>Add Orange</button>
    </>
  )
}

export default App
```

还可以只使用 `produce` 函数：

```tsx
import { produce } from 'use-immer-state'

const baseState = {
  fruits: ['apple', 'pear']
}

const result = produce(baseState, (draft) => {
  draft.fruits.push('orange')
})
```
