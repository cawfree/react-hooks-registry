# react-hooks-registry
Custom hooks for equally custom React renderers. Inspired by [Swyx](https://twitter.com/swyx)'s [Deep Dive on React Hooks](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/).

<strike>Currently, [React Hooks](https://reactjs.org/docs/hooks-intro.html) impose a dependency on the runtime version React DOM. This makes it difficult to roll hooks-based applications in the context of [custom React renderers](https://github.com/nitin42/Making-a-custom-React-renderer). This repository aims to make it possible to work around this restriction.</strike>

## 🚀 Getting Started

Using [`npm`]():

```bash
npm install --save react-hooks-registry
```

Using [`yarn`]():

```bash
yarn add react-hooks-registry
```

## ✍️ Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import HooksRegistry, { useState, useEffect } from 'react-hooks-registry';

const App = ({ ...extraProps }) => {
  const { state, setState } = useState('hello, world');
  useEffect(
    () => {
      setTimeout(
        () => setState('goodbye, world'),
        1000,
      );
    },
    [],
  );
  return (
    <div className="App">
      <code>
        {state}
      </code>
    </div>
  );
};

HooksRegistry
  .register(
    App,
    ReactDOM.render, // or use a custom renderer
    document.getElementById('root'),
  );
```

## ✌️  License 
[MIT](https://opensource.org/licenses/MIT)
