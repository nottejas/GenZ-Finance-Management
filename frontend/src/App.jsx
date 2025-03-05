import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { SignedOut, SignIn, SignOutButton, SignUp } from '@clerk/clerk-react'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='login' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='signout' element={<SignedOut />} />
        <Route path='signoutt' element={<SignOutButton />} />
      </Routes>
    </Router>
  )
}

export default App
