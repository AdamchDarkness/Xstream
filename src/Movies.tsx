import React, { useEffect, useState } from "react"
import { fetchXtreamMovies } from "./utils/fetchXtreamMovies"
import VideoPlayer from "./VideoPlayer"
import { Search, Calendar, SortAsc } from "lucide-react"

type Movie = {
  name: string
  logo: string
  year: string
  category: string
  stream_id: number
  container_extension?: string
  direct_source?: string
  custom_sid?: string
}

const ITEMS_PER_PAGE = 20

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMovieUrl, setSelectedMovieUrl] = useState<string | null>(null)
  const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"year" | "name">("year")
  const [credentials, setCredentials] = useState({ server: "", username: "", password: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("iptvSession")
    if (!session) return

    const { server, username, password } = JSON.parse(session)
    setCredentials({ server, username, password })

    setLoading(true)
    fetchXtreamMovies(server, username, password).then((data) => {
      const parsed = data.map((item) => ({
        name: item.name,
        logo: item.stream_icon,
        year: item.added?.split(" ")[0] || "N/A",
        category: item.category_id,
        stream_id: item.stream_id,
        container_extension: item.container_extension,
        direct_source: item.direct_source,
        custom_sid: item.custom_sid,
      }))
      setMovies(parsed)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const filtered = movies
      .filter(
        (m) =>
          (category === "All" || m.category === category) &&
          m.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortBy === "year"
          ? parseInt(b.year) - parseInt(a.year)
          : a.name.localeCompare(b.name)
      )

    setFilteredMovies(filtered)
    setCurrentPage(1)
  }, [movies, search, category, sortBy])

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE)
  const currentItems = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleMovieClick = (movie: Movie) => {
    const url =
      movie.direct_source ||
      `${credentials.server}/movie/${credentials.username}/${credentials.password}/${movie.stream_id}.${movie.container_extension || "mp4"}${
        movie.custom_sid ? `?token=${movie.custom_sid}` : ""
      }`

    setSelectedMovieUrl(url)
    setSelectedMovieTitle(movie.name)
  }

  const uniqueCategories = Array.from(new Set(movies.map((m) => m.category))).sort()

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">🎬 Movies</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-2.5 text-white/50" />
          <input
            type="text"
            placeholder="Search movies..."
            className="pl-10 pr-4 py-2 w-full bg-white/10 rounded text-white placeholder-white/40 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("year")}
            className={`px-4 py-1.5 rounded ${sortBy === "year" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
          >
            <Calendar className="inline w-4 h-4 mr-1" />
            Year
          </button>
          <button
            onClick={() => setSortBy("name")}
            className={`px-4 py-1.5 rounded ${sortBy === "name" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
          >
            <SortAsc className="inline w-4 h-4 mr-1" />
            Name
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-1.5 rounded-full ${category === "All" ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
          onClick={() => setCategory("All")}
        >
          All
        </button>
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full ${category === cat ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-white/70">Loading movies...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentItems.map((m, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-blue-600 border border-white/10 transition"
                onClick={() => handleMovieClick(m)}
              >
                <img
                  src={m.logo || "/placeholder.svg"}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium truncate">{m.name}</h3>
                  <p className="text-sm text-white/50">{m.year}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedMovieUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center flex-col px-4">
          <div className="w-full max-w-6xl">
            <button
              onClick={() => {
                setSelectedMovieUrl(null)
                setSelectedMovieTitle("")
              }}
              className="mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
            >
              ← Back to Movies
            </button>

            <VideoPlayer src={selectedMovieUrl} title={selectedMovieTitle} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Movies
