import React, { useState, useEffect } from "react"

interface LoginFormProps {
  onLoginSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [server, setServer] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("iptvSession")
    if (saved) {
      onLoginSuccess()
    }
  }, [onLoginSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sessionData = { server, username, password }

    // Tu peux tester la validité ici avant de stocker
    setTimeout(() => {
      localStorage.setItem("iptvSession", JSON.stringify(sessionData))
      setLoading(false)
      onLoginSuccess()
    }, 1000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
    >
      <h2 className="text-2xl text-center font-bold text-blue-500 mb-2">StreamVue Login</h2>

      <div>
        <label className="block text-white mb-1">Server URL</label>
        <input
          type="text"
          value={server}
          onChange={(e) => setServer(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          placeholder="http://example.com:8080"
        />
      </div>

      <div>
        <label className="block text-white mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          placeholder="username"
        />
      </div>

      <div>
        <label className="block text-white mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Connecting..." : "Sign In"}
      </button>
    </form>
  )
}

export default LoginForm
