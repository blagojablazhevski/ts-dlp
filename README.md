# ts-dlp

A lightweight, fluent TypeScript wrapper for yt-dlp made for humans.

`ts-dlp` aims to make downloading media with yt-dlp feel natural in Node.js and TypeScript projects through a chainable, strongly-typed API.

---

## Features

- Fluent builder-style API
- Fully typed with TypeScript
- Uses your local yt-dlp installation
- Promise-based API
- Easy process handling
- Cross-platform support

---

## Current Status

> Early development / proof of concept

Current functionality:

- Detects whether `yt-dlp` is installed and available in PATH

---

# Installation

```bash
npm install ts-dlp
```

You must also have yt-dlp installed on your system.

## Install yt-dlp

### Windows

```bash
winget install yt-dlp.yt-dlp
```

### macOS

```bash
brew install yt-dlp
```

### Linux

```bash
pip install -U yt-dlp
```

Official project:

https://www.npmjs.com/package/@blagoja/ts-dlp

---

# Vision

Instead of writing:

```bash
yt-dlp -f "bestvideo[height<=1080]+bestaudio" URL
```

You write:

```ts
await ytdlp.download(url).resolution("1080p").audio("best").merge().run();
```

---

# Example API (Planned)

```ts
import {ytdlp} from "ts-dlp";

await ytdlp
	.download("https://youtube.com/watch?v=...")
	.resolution("1080p")
	.fps(60)
	.format("mp4")
	.output("./downloads")
	.run();
```

---

# Goals

- Make yt-dlp easier to use from Node.js
- Avoid manually constructing CLI arguments
- Provide autocomplete and type safety
- Keep the wrapper lightweight
- Stay close to native yt-dlp functionality

---

# Roadmap

## v0.1.0 - Foundation

- [x] Detect yt-dlp installation
- [x] Execute simple yt-dlp commands
- [ ] Basic command runner
- [ ] Error handling
- [ ] Capture stdout/stderr
- [ ] TypeScript support
- [ ] Unit test setup
- [x] `.download(url)`
- [x] `.run()`
- [x] `.output(path)`
- [x] `.format(format)`
- [x] `.audio()`
- [ ] `.video()`
- [x] `.resolution()`
- [x] `.fps()`

Example:

```ts
await ytdlp.download(url).resolution("720p").run();
```

---

## v0.2.0 - Metadata & Information

- [ ] `.info()`
- [ ] Video metadata parsing
- [ ] JSON output support
- [ ] Playlist support
- [ ] Progress events

Example:

```ts
const info = await ytdlp.info(url);
```

---

## v0.3.0 - Advanced Features

- [ ] Subtitle support
- [ ] Thumbnail downloads
- [ ] Playlist filtering
- [ ] Cookies support
- [ ] Proxy support
- [ ] Custom yt-dlp arguments

---

## v0.4.0 - Developer Experience

- [ ] Better typed builders
- [ ] Presets
- [ ] Config files
- [ ] Improved documentation
- [ ] More examples
- [ ] CI/CD pipeline
- [ ] Automated tests

---

# Non-Goals

At least for now, `ts-dlp` will NOT:

- Bundle yt-dlp binaries
- Replace yt-dlp functionality
- Abstract every yt-dlp flag
- Become a GUI application

The goal is to remain a lightweight developer wrapper.

---

# Contributing

Contributions, suggestions, and issue reports are welcome.

If you have an idea for the API design or developer experience, feel free to open an issue.

---

# License

MIT
