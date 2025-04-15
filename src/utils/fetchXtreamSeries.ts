// utils/fetchXtreamSeries.ts
export interface XtreamSeries {
    name: string
    stream_id: number
    stream_icon: string
    added: string
    category_id: string
    container_extension?: string
    custom_sid?: string
  }
  
  export async function fetchXtreamSeries(
    server: string,
    username: string,
    password: string
  ): Promise<XtreamSeries[]> {
    const url = `${server}/player_api.php?username=${username}&password=${password}&action=get_series`
  
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  
      const data: XtreamSeries[] = await res.json()
      return data || []
    } catch (error) {
      console.error("Failed to fetch Xtream series:", error)
      return []
    }
  }
  