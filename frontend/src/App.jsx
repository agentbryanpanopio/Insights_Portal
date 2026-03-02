import { useState } from 'react';
import MainLayout from './components/MainLayout';

function App() {
  // Mock user for now - no authentication needed
  const mockUser = {
    id: 'demo-user',
    email: 'demo@insightsportal.com',
    fullName: 'Demo User'
  };

  const handleLogout = () => {
    // Just reload the page
    window.location.reload();
  };

  return (
    <MainLayout user={mockUser} onLogout={handleLogout} />
  );
}

export default App;