# Changelog

## [0.1.3] - 2026-05-27

### Added

- Added `VideoExt` type for video file extension filtering with common extensions (mp4, mov, webm, flv, mkv, avi)
- Added `format(ext: VideoExt)` method to filter by video file extension
- Added `fps(fps: number)` method to filter by maximum frame rate

### Modified

- Refactored video filter state into separate fields (`videoHeight`, `videoFps`, `videoExt`) to eliminate call-order conflicts between `resolution()`, `fps()`, and `format()`
- Extracted `buildArgs()` private method from `run()` to centralize argument assembly

## [0.1.2] - 2026-05-27

### Added

- Added types for `Resolution` and `AudioCodec` for better type safety and autocompletion
- Added type `OutputFields` for filename template fields to provide better autocompletion when specifying output templates

### Modified

- Separate audio and resolution format options for more flexibility
- Separate output dir and filename template options for better control over output paths

## [0.1.1] - 2026-05-27

### Added

- CJS support via dual ESM/CJS build

## [0.1.0] - 2026-05-27

### Added

- Initial release
