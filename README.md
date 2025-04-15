# Xstrem - IPTV Desktop App (Electron + React + Vite)

**Xstrem** is a modern, responsive IPTV player built with React, Vite, Tailwind CSS, and Electron. It supports Xtream Codes and M3U links, allowing users to explore Live TV, Movies, and Series with episode-level control.

## 🚀 Features

- 🎥 Live TV categorized by group
- 🎬 Movies with search, sorting, and pagination
- 📺 Series browser with seasons & episodes
- 🔍 Real-time search and filters
- 🧠 Smart playback with ShakaPlayer (supports .m3u8, .mp4, .ts, .mkv...)
- 💾 Session saved in browser (LocalStorage)
- 🖥️ Works as both a web app and desktop app (Electron)

## 🛠 Tech Stack

- React + Vite
- Tailwind CSS + Lucide Icons
- Electron for desktop packaging
- ShakaPlayer for smooth video playback
- Xtream Codes / M3U parsing

## 🧪 Run in Development

```bash
# Install dependencies
npm install

# Start Vite server (frontend)
npm run dev

# Start Electron (in another terminal)
npm run electron
```

## 📦 Build for Production

```bash
# Build React app
npm run build

# Update electron/main.cjs to load dist/index.html:
# win.loadFile(path.join(__dirname, '../dist/index.html'))

# Start Electron in production mode
npm run electron
```

## 🖥 Packaging (Optional)

For .exe or .dmg packaging, you can use `electron-builder`:

```bash
npm install --save-dev electron-builder
npx electron-builder
```

## 💡 Future Features

- Auto-update support
- Favorites / watch history
- Subtitles / language switching

---

Made with ❤️ by Adam Charof
