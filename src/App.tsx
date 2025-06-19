import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Subscription } from './pages/Subscription';

function App() {
  return (
    <ThemeProvider>
      <Subscription />
    </ThemeProvider>
  );
}

export default App;
