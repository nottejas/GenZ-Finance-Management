import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-react';
import { TransactionProvider } from './context/TransactionContext';
import { SettingsProvider } from './context/SettingsContext';
import EducationProvider from './context/EducationContext';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

// Mock API for development
import { setupMockAPI } from './mockApi';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key. Please check your environment variables.");
}

// Setup mock API in development environment
if (import.meta.env.DEV) {
  setupMockAPI();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <TransactionProvider>
          <SettingsProvider>
            <EducationProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: 'rgba(40, 167, 69, 0.9)',
                    },
                  },
                  error: {
                    style: {
                      background: 'rgba(220, 53, 69, 0.9)',
                    },
                  },
                }}
              />
              <App />
            </EducationProvider>
          </SettingsProvider>
        </TransactionProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)
