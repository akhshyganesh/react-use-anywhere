import React from 'react';
import { HookProvider, useHookService } from 'react-use-anywhere';
import {
  counterService,
  incrementCounter,
  decrementCounter,
  resetCounter,
  doubleCounter,
  logCounterValue,
  CounterHook,
} from './services/counterService';

// Custom counter hook
const useCounter = (): CounterHook => {
  const [count, setCount] = React.useState(0);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(0);

  return { count, increment, decrement, reset };
};

// Component that demonstrates using the service from outside React!
const Counter: React.FC = () => {
  useHookService(counterService, 'counter');
  const counter = counterService.get();

  if (!counter) {
    return <div>Loading...</div>;
  }

  const { count } = counter;

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial',
        border: '2px solid #007bff',
      }}
    >
      <h2>React 17 Compatibility Test</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Count: {count}</p>

      <div style={{ marginBottom: '15px' }}>
        <h3>Standard Buttons (From Service!):</h3>
        <button onClick={incrementCounter}>Increment</button>
        <button onClick={decrementCounter} style={{ marginLeft: '10px' }}>
          Decrement
        </button>
        <button onClick={resetCounter} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h3>Advanced Functions (From Service!):</h3>
        <button
          onClick={doubleCounter}
          style={{ background: '#28a745', color: 'white' }}
        >
          Double Count
        </button>
        <button
          onClick={logCounterValue}
          style={{ marginLeft: '10px', background: '#6c757d', color: 'white' }}
        >
          Log to Console
        </button>
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        💡 All buttons call functions from counterService.ts - a plain
        TypeScript file!
      </div>
    </div>
  );
};

// Another component to test shared state
const CounterDisplay: React.FC = () => {
  useHookService(counterService, 'counter');
  const counter = counterService.get();

  if (!counter) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}
    >
      <h3>Shared State Display</h3>
      <p>The count is: {counter.count}</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HookProvider hooks={{ counter: useCounter }}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>React 17 + react-use-anywhere Test</h1>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
          This demo shows React hooks being called from a plain TypeScript
          service file! Check <code>src/services/counterService.ts</code>
        </p>
        <Counter />
        <CounterDisplay />
      </div>
    </HookProvider>
  );
};

export default App;
