import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';


const clerk_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log(clerk_key);

if(!clerk_key){
  throw new Error("key not found")
}

createRoot(document.getElementById('root')).render(

    <ClerkProvider publishableKey={clerk_key}>
    <App />
    </ClerkProvider>
)
