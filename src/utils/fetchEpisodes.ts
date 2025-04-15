// utils/fetchEpisodes.ts

interface Episode {
    id: number
    title: string
    container_extension: string
    custom_sid?: string
  }
  
  interface Season {
    season_number: string
    episodes: Episode[]
  }
  
  interface XtreamEpisodeResponse {
    episodes: {
      [season: string]: Episode[]
    }
  }
  
  export async function fetchEpisodes(
    server: string,
    username: string,
    password: string,
    series_id: number
  ): Promise<Season[]> {
    const url = `${server}/player_api.php?username=${username}&password=${password}&action=get_series_info&series_id=${series_id}`
  
    try {
      const res = await fetch(url)
      const data: XtreamEpisodeResponse = await res.json()
  
      return Object.entries(data.episodes || {}).map(([season, episodes]) => ({
        season_number: season,
        episodes,
      }))
    } catch (err) {
      console.error("Error fetching episodes:", err)
      return []
    }
  }
  