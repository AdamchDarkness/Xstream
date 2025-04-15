import React, { useEffect, useState } from "react"
import { fetchXtreamSeries } from "./utils/fetchXtreamSeries"
import { fetchEpisodes } from "./utils/fetchEpisodes"
import ShakaPlayer from "./VideoPlayer"
import { Search, Calendar, SortAsc } from "lucide-react"

type Serie = {
  name: string
  logo: string
  year: string
  category: string
  stream_id: number
  container_extension?: string
  custom_sid?: string
}

type Episode = {
  id: number
  title: string
  container_extension: string
  custom_sid?: string
}

type Season = {
  season_number: string
  episodes: Episode[]
}

const ITEMS_PER_PAGE = 20

const Series: React.FC = () => {
  const [series, setSeries] = useState<Serie[]>([])
  const [filtered, setFiltered] = useState<Serie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null)
  const [episodesBySeason, setEpisodesBySeason] = useState<Season[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<{ url: string; title: string } | null>(null)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"year" | "name">("year")
  const [credentials, setCredentials] = useState({ server: "", username: "", password: "" })

  useEffect(() => {
    const session = localStorage.getItem("iptvSession")
    if (!session) return

    const { server, username, password } = JSON.parse(session)
    setCredentials({ server, username, password })

    fetchXtreamSeries(server, username, password).then((data) => {
      const parsed = data.map((item) => ({
        name: item.name,
        logo: item.stream_icon,
        year: item.added?.split(" ")[0] || "N/A",
        category: item.category_id,
        stream_id: item.stream_id,
        container_extension: item.container_extension,
        custom_sid: item.custom_sid,
      }))
      setSeries(parsed)
    })
  }, [])

  useEffect(() => {
    const filtered = series
      .filter(
        (s) =>
          (category === "All" || s.category === category) &&
          s.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortBy === "year" ? parseInt(b.year) - parseInt(a.year) : a.name.localeCompare(b.name)
      )

    setFiltered(filtered)
    setCurrentPage(1)
  }, [series, search, category, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSerieClick = async (serie: Serie) => {
    setSelectedSerie(serie)
    const seasons = await fetchEpisodes(credentials.server, credentials.username, credentials.password, serie.stream_id)
    setEpisodesBySeason(seasons)
  }

  const handleEpisodeClick = (episode: Episode) => {
    const url = `${credentials.server}/series/${credentials.username}/${credentials.password}/${episode.id}.${episode.container_extension || "mp4"}${
      episode.custom_sid ? `?token=${episode.custom_sid}` : ""
    }`

    setSelectedEpisode({ url, title: episode.title })
  }

  const uniqueCategories = Array.from(new Set(series.map((s) => s.category))).sort()

  return (
    <div className="p-6 text-white">
      {!selectedSerie && (
        <>
          <h2 className="text-2xl font-bold text-blue-500 mb-4">📺 Series</h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-3 top-2.5 text-white/50" />
              <input
                type="text"
                placeholder="Search series..."
                className="pl-10 pr-4 py-2 w-full bg-white/10 rounded text-white placeholder-white/40 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSortBy("year")} className={`px-4 py-1.5 rounded ${sortBy === "year" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}>
                <Calendar className="inline w-4 h-4 mr-1" /> Year
              </button>
              <button onClick={() => setSortBy("name")} className={`px-4 py-1.5 rounded ${sortBy === "name" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}>
                <SortAsc className="inline w-4 h-4 mr-1" /> Name
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button className={`px-4 py-1.5 rounded-full ${category === "All" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`} onClick={() => setCategory("All")}>
              All
            </button>
            {uniqueCategories.map((cat) => (
              <button key={cat} className={`px-4 py-1.5 rounded-full ${category === cat ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`} onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentItems.map((s, i) => (
              <div key={i} className="bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-blue-600 border border-white/10 transition" onClick={() => handleSerieClick(s)}>
                <img src={s.logo || "/placeholder.svg"} alt={s.name} loading="lazy" className="w-full h-48 object-cover" />
                <div className="p-3">
                  <h3 className="font-medium truncate">{s.name}</h3>
                  <p className="text-sm text-white/50">{s.year}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center gap-4">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30">Previous</button>
            <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30">Next</button>
          </div>
        </>
      )}

      {selectedSerie && !selectedEpisode && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedSerie.name}</h2>
            <button onClick={() => setSelectedSerie(null)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              ← Back to Series
            </button>
          </div>

          {episodesBySeason.map((season) => (
            <div key={season.season_number} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Season {season.season_number}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {season.episodes.map((ep) => (
                  <button key={ep.id} onClick={() => handleEpisodeClick(ep)} className="bg-white/10 hover:bg-white/20 text-left p-3 rounded">
                    <p className="font-medium">{ep.title}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {selectedEpisode && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center flex-col px-4">
          <div className="w-full max-w-6xl">
            <button
              onClick={() => setSelectedEpisode(null)}
              className="mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
            >
              ← Back to Episodes
            </button>
            <ShakaPlayer src={selectedEpisode.url} title={selectedEpisode.title} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Series
