import React, { useEffect, useRef } from "react"
import shaka from "shaka-player"

interface Props {
  src: string
  title?: string
}

const VideoPlayer: React.FC<Props> = ({ src, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Vérifie si Shaka est supporté
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Shaka Player is not supported in this browser.")
      return
    }

    const player = new shaka.Player(video)

    // Gestion des erreurs
    player.addEventListener("error", (e) => {
      console.error("Shaka Player Error", e)
    })

    // Configuration du player
    player.configure({
      streaming: {
        bufferingGoal: 30, // secondes de pré-chargement
      },
    })

    // Chargement de la vidéo
    player.load(src).catch((error) => {
      console.error("Error loading stream", error)
    })

    return () => {
      player.destroy()
    }
  }, [src])

  return (
    <div className="w-full max-w-6xl mx-auto">
      {title && <h2 className="text-white text-xl mb-4">{title}</h2>}
      <video
        ref={videoRef}
        controls
        autoPlay
        className="w-full rounded shadow-lg"
        style={{ backgroundColor: "black" }}
      />
    </div>
  )
}

export default VideoPlayer
