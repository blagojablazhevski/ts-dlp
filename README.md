<div align="center">

[![ts-dlp](https://i.imgur.com/UX6vDEk_d.webp?maxwidth=760&fidelity=grand)](#readme)

</div>

# ts-dlp

A lightweight, fluent TypeScript wrapper for [yt-dlp](https://github.com/yt-dlp/yt-dlp) made for humans.

`ts-dlp` makes using yt-dlp feel natural in Node.js and TypeScript projects through a chainable, strongly-typed API.

---

## Why ts-dlp?

yt-dlp is extremely powerful, but constructing CLI arguments manually from Node.js can become difficult to maintain and hard to type safely.

`ts-dlp` provides a fluent TypeScript API that keeps you close to native yt-dlp functionality while improving developer experience.

---

## Features

- Fluent builder-style API
- Fully typed with TypeScript
- Uses your local yt-dlp installation
- Promise-based
- Easy process handling
- Cross-platform

---

## Current Status

> Early development / proof of concept

---

## Installation

```bash
npm install ts-dlp
```

`ts-dlp` requires a local yt-dlp installation available in your system PATH.

### Install yt-dlp

**Windows**

```bash
winget install yt-dlp.yt-dlp
```

**macOS**

```bash
brew install yt-dlp
```

**Linux**

```bash
pip install -U yt-dlp
```

Official yt-dlp project: [https://github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)

---

## Quick Start

Instead of writing:

```bash
yt-dlp -f "bestvideo[height<=1080]+bestaudio" -o "downloads/%(title)s.%(ext)s" URL
```

You write:

```ts
import {download} from "ts-dlp";

await download("https://youtube.com/watch?v=...")
	.resolution("1080p")
	.output("downloads")
	.run();
```

---

## API

```ts
import {download} from "ts-dlp";

await download("https://youtube.com/watch?v=...")
	.resolution("1080p")
	.fps(60)
	.format("mp4")
	.audio("aac")
	.output("./downloads")
	.filename(({title, ext}) => `${title}.${ext}`)
	.run();
```

### Methods

| Method                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `.resolution(res)`    | Max video resolution (e.g. `"1080p"`, `"720p"`)    |
| `.format(ext)`        | Preferred video container (e.g. `"mp4"`, `"webm"`) |
| `.fps(fps)`           | Max frame rate (e.g. `60`)                         |
| `.audio(codec?)`      | Audio codec preference (e.g. `"aac"`, `"mp3"`)     |
| `.output(dir)`        | Output directory                                   |
| `.filename(template)` | Filename template string or callback               |
| `.run()`              | Execute the download                               |

---

## Philosophy

`ts-dlp` aims to stay thin and predictable.

The project does not attempt to hide yt-dlp or replace its ecosystem. Instead, it focuses on:

- Better TypeScript ergonomics
- Safer command construction
- Cleaner process handling
- Fluent APIs

`ts-dlp` will not try to model every yt-dlp flag as a typed method. Instead, future versions will expose escape hatches for advanced usage:

```ts
// Planned
await download(url)
	.customFormat("bestvideo[height<=1080][vcodec^=avc]+bestaudio[ext=m4a]")
	.args(["--no-playlist", "--write-subs"])
	.run();
```

---

## Goals

- Make yt-dlp easier to use from Node.js
- Avoid manually constructing CLI arguments
- Provide autocomplete and type safety
- Keep the wrapper lightweight
- Stay close to native yt-dlp functionality

---

## Roadmap

### v0.1.0 - Foundation

- [x] Detect yt-dlp installation
- [x] Execute yt-dlp commands
- [x] `.download(url)` / `.run()`
- [x] `.output(path)`
- [x] `.format(ext)`
- [x] `.audio(codec?)`
- [x] `.resolution(res)`
- [x] `.fps(fps)`
- [x] `.filename(template)`
- [x] Error handling
- [ ] Capture stdout/stderr
- [ ] Unit test setup

### v0.2.0 - Metadata & Information

- [ ] `.info(url)` - fetch video metadata
- [ ] JSON output support
- [ ] Playlist support
- [ ] Progress events

### v0.3.0 - Advanced Features

- [ ] Subtitle support
- [ ] Thumbnail downloads
- [ ] Playlist filtering
- [ ] Cookies support
- [ ] Proxy support
- [ ] `.customFormat(selector)` escape hatch
- [ ] `.args(flags[])` escape hatch

### v0.4.0 - Developer Experience

- [ ] Presets
- [ ] Config file support
- [ ] Improved documentation
- [ ] CI/CD pipeline
- [ ] Automated tests

---

## Non-Goals

At least for now, `ts-dlp` will NOT:

- Bundle yt-dlp binaries
- Replace yt-dlp functionality
- Abstract every yt-dlp flag into typed methods
- Become a GUI application

The goal is to remain a lightweight developer wrapper.

---

## Contributing

Contributions, suggestions, and issue reports are welcome.

If you have ideas for the API design or developer experience, feel free to open an issue.

This project follows [Conventional Commits](https://www.conventionalcommits.org/) and maintains a [CHANGELOG](./CHANGELOG.md).

---

## Disclaimer

`ts-dlp` is a developer wrapper around yt-dlp. Users are responsible for complying with the terms of service and applicable laws of the media sources they access.

---

## License

MIT
