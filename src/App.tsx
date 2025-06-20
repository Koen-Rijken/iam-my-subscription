import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Subscription } from './pages/Subscription';
import { Success } from './pages/Success';

function App() {
  const isSuccessPage = window.location.pathname === '/success';

  return (
    <ThemeProvider>
      {isSuccessPage ? <Success /> : <Subscription />}
    </ThemeProvider>
  );
}

export default App;