import React, { useState } from "react"
import LiveTV from "./LiveTV"
import Movies from "./Movies"

type Section = "live" | "movies" | "series"

const Dashboard: React.FC = () => {
  const [section, setSection] = useState<Section>("live")

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">🎬 StreamVue</h1>

      <div className="flex justify-center gap-4 mb-6">
        {["live", "movies", "series"].map((s) => (
          <button
            key={s}
            onClick={() => setSection(s as Section)}
            className={`capitalize px-4 py-2 rounded ${
              section === s ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {section === "live" && <LiveTV />}
      {section === "movies" &&  <Movies />}
      {section === "series" && (
        <p className="text-center text-white/50 mt-20 text-xl">📺 Series coming soon...</p>
      )}
    </div>
  )
}

export default Dashboard
