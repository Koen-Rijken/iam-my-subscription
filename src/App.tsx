import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Subscription } from './pages/Subscription';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Subscription />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
