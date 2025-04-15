interface Channel {
    name: string
    group: string
    logo: string
    url: string
  }
  
  export async function parseM3U(url: string): Promise<Channel[]> {
    const res = await fetch(url)
    const text = await res.text()
    const lines = text.split("\n")
    const channels: Channel[] = []
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
  
      if (line.startsWith("#EXTINF")) {
        const nameMatch = /,(.*)/.exec(line)
        const logoMatch = /tvg-logo="(.*?)"/.exec(line)
        const groupMatch = /group-title="(.*?)"/.exec(line)
        const urlLine = lines[i + 1]?.trim()
  
        if (urlLine?.startsWith("http")) {
          channels.push({
            name: nameMatch?.[1] ?? "Unknown",
            group: groupMatch?.[1] ?? "Others",
            logo: logoMatch?.[1] ?? "",
            url: urlLine,
          })
        }
      }
    }
  
    return channels
  }
  