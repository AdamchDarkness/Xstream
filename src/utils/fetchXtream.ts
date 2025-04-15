interface XtreamChannel {
    name: string
    stream_id: number
    stream_icon: string
    category_id: string
    stream_type: string
  }
  
  export async function fetchXtreamChannels(server: string, username: string, password: string): Promise<XtreamChannel[]> {
    const url = `${server}/player_api.php?username=${username}&password=${password}&action=get_live_streams`
    const res = await fetch(url)
    const data = await res.json()
    return data || []
  }
  