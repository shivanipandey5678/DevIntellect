import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";

import Chat from "./pages/Chat.jsx";

function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route  path='/chat' element={<Chat/>}/>
    </Routes>
   
    </div>
  )
}

export default App
