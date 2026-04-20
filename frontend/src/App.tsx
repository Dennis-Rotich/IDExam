import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div className="app-container min-h-screen">
      <Outlet />
    </div>
  )
}

export default App
