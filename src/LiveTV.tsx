import React, { useEffect, useState } from "react"
import { parseM3U } from "./utils/parseM3U"
import { fetchXtreamChannels } from "./utils/fetchXtream"
import VideoPlayer from "./VideoPlayer"

type Channel = {
  name: string
  group: string
  logo: string
  url: string
}

const LiveTV: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const session = localStorage.getItem("iptvSession")
    if (!session) return

    const { server, username, password } = JSON.parse(session)

    if (server.includes("m3u") || server.endsWith(".m3u") || server.includes("get.php")) {
      parseM3U(server).then(setChannels)
    } else {
      fetchXtreamChannels(server, username, password).then((data) => {
        const parsed = data.map((item) => ({
          name: item.name,
          group: item.category_id,
          logo: item.stream_icon,
          url: `${server}/live/${username}/${password}/${item.stream_id}.ts`,
        }))
        setChannels(parsed)
      })
    }
  }, [])

  const uniqueCategories = Array.from(new Set(channels.map((c) => c.group))).sort()
  const filteredChannels =
    selectedCategory === "All"
      ? channels
      : channels.filter((c) => c.group === selectedCategory)

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Live Channels</h2>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-1.5 rounded-full ${
            selectedCategory === "All" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full ${
              selectedCategory === cat ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CHANNELS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredChannels.map((c, i) => (
          <div
            key={i}
            className="bg-white/10 p-4 rounded-lg cursor-pointer hover:border-blue-500 transition"
            onClick={() => setSelectedChannel(c)}
          >
            <img
              src={c.logo || "/placeholder.svg"}
              alt={c.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h3 className="font-semibold truncate">{c.name}</h3>
            <p className="text-sm text-white/60 truncate">{c.group}</p>
          </div>
        ))}
      </div>

      {/* VIDEO PLAYER */}
      {selectedChannel && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setSelectedChannel(null)}
              className="text-white text-2xl bg-red-600 px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
          <VideoPlayer src={selectedChannel.url} title={selectedChannel.name} />
        </div>
      )}
    </div>
  )
}

export default LiveTV
