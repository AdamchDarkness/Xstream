export interface XtreamMovie {
  name: string
  stream_id: number
  stream_icon: string
  added: string
  category_id: string
  container_extension?: string
  direct_source?: string
  custom_sid?: string // parfois utilisé comme token
}

export async function fetchXtreamMovies(
  server: string,
  username: string,
  password: string
): Promise<XtreamMovie[]> {
  const url = `${server}/player_api.php?username=${username}&password=${password}&action=get_vod_streams`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data: XtreamMovie[] = await res.json()
    return data || []
  } catch (error) {
    console.error("Failed to fetch Xtream movies:", error)
    return []
  }
}
