import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Subscription } from './pages/Subscription';
import { Success } from './pages/Success';

function App() {
  const isSuccessPage = window.location.pathname === '/success';

  return (
    <ThemeProvider>
      <AuthProvider>
        {isSuccessPage ? <Success /> : <Subscription />}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
