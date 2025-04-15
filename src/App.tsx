import React, { useEffect, useState } from "react"
import LoginForm from "./LoginForm"
import Dashboard from "./Dashboard"

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("iptvSession")
    if (session) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {!isLoggedIn ? (
        <div className="flex items-center justify-center h-full py-12">
          <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default App
