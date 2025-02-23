/* eslint-disable @typescript-eslint/no-explicit-any */


import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignInForm from './pages/auth/Sign'
import Conversation from './pages/chat/Conversation'
import { useSelector } from 'react-redux'
function App() {
  const userSlice = useSelector((state: { userSlice: any }) => state.userSlice)
  const { user } = userSlice
  return (
    <BrowserRouter>

      <Routes>
        <Route path='/signIn' element={<SignInForm />}></Route>
        <Route path='/' element={user ? <Conversation /> : <SignInForm />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
