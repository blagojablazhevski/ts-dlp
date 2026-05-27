import {runYtDlp} from "./internal/runner.js";
import type {AudioCodec, OutputFields, Resolution, VideoExt} from "./types.js";

export class DownloadBuilder {
	private readonly args: string[] = [];
	private videoFormat?: string;
	private audioFormat?: string;
	private outputDir?: string;
	private filenameTemplate?: string;
	private videoExt?: VideoExt;
	private videoFps?: number;
	private videoHeight?: string;

	constructor(private readonly url: string) {}

	private buildArgs(): string[] {
		const args = [...this.args];
		if (
			this.videoHeight ||
			this.videoFps ||
			this.videoExt ||
			this.audioFormat
		) {
			const heightFilter = this.videoHeight
				? `[height<=${this.videoHeight}]`
				: "";
			const fpsFilter = this.videoFps ? `[fps<=${this.videoFps}]` : "";
			const extFilter = this.videoExt ? `[ext=${this.videoExt}]` : "";
			const video = `bestvideo${heightFilter}${fpsFilter}${extFilter}`;
			const audio = this.audioFormat ?? "bestaudio";
			args.push("-f", `${video}+${audio}/best`);
		}
		if (this.outputDir || this.filenameTemplate) {
			const dir = this.outputDir ?? "";
			const file = this.filenameTemplate ?? "%(title)s.%(ext)s";
			args.push("-o", dir ? `${dir}/${file}` : file);
		}
		return args;
	}

	/**
	 * Set the desired resolution for the video download.
	 * The method will automatically select the best video format that is less than or equal to the specified resolution.
	 * For example, if you specify "720p", it will select the best available video format that is 720p or lower.
	 *
	 * @param res The desired resolution for the video. You can specify common resolutions like "720p", "1080p", etc. The method will automatically select the best video format that is less than or equal to the specified resolution.
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	resolution(res: Resolution): this {
		// const height = res.replace("p", "");
		// this.videoFormat = `bestvideo[height<=${height}]`;
		this.videoHeight = res.replace("p", "");
		return this;
	}

	/**
	 * Set the output directory for the downloaded file. You can specify a directory path like "downloads".
	 * If not specified, the file will be saved in the current working directory.
	 *
	 * @example
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 * .output("downloads")
	 * .run();
	 *
	 * @param dir The output directory where the downloaded file will be saved.
	 * You can specify a directory path like "downloads". If not specified, the file will be saved in the current working directory.
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	output(dir: string): this {
		this.outputDir = dir;
		return this;
	}

	/**
	 * Set the desired audio codec for the download.
	 * The method will select the best available audio format that matches the specified codec.
	 * If no codec is specified, it will select the best available audio format regardless of codec.
	 *
	 * @example // Specifying an audio codec
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 * .audio("mp3")
	 * .run();
	 *
	 * @param codec The desired audio codec for the download. You can specify common audio codecs like "mp3", "aac", "opus", etc. If no codec is specified, it will select the best available audio format.
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	audio(codec?: AudioCodec): this {
		this.audioFormat = codec ? `bestaudio[ext=${codec}]` : "bestaudio";
		return this;
	}

	/**
	 * Set the desired video file extension for the download. You can specify common video extensions like "mp4", "mkv", "webm", etc.
	 * If specified, the method will select the best available video format that matches the specified extension.
	 * If not specified, it will select the best available video format regardless of extension.
	 *
	 * @example
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 * .format("mp4")
	 * .run();
	 *
	 * @param ext The desired video file extension for the download. You can specify common video extensions like "mp4", "mkv", "webm", etc. If specified, the method will select the best available video format that matches the specified extension. If not specified, it will select the best available video format regardless of extension.
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	format(ext: VideoExt): this {
		this.videoExt = ext;
		return this;
	}

	fps(fps: number): this {
		this.videoFps = fps;
		return this;
	}

	/**
	 * Set the filename template for the downloaded file.
	 * The callback receives common output fields as named parameters which are
	 * automatically mapped to their values at download time.
	 *
	 * @example // Using a string template
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 * 	.output("downloads")
	 * 	.filename("%(title)s.%(ext)s")
	 *
	 * @example // Using a callback to specify a custom filename template
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 * 	.output("downloads")
	 * 	.filename(({ title, ext }) => `${title}.${ext}`)
	 * 	.run();
	 *
	 * @param template A callback that receives output fields and returns a filename string. If omitted, defaults to the video title with its original extension.
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	filename(template: ((fields: OutputFields) => string) | string): this {
		if (typeof template === "string") {
			this.filenameTemplate = template;
		} else {
			const fields = new Proxy({} as OutputFields, {
				get(_, prop: keyof OutputFields) {
					return `%(${prop})s`;
				},
			});
			this.filenameTemplate = template(fields);
		}
		return this;
	}

	/**
	 * Execute the download with the specified options.
	 * This will run yt-dlp with the accumulated arguments and the provided URL.
	 * The output will be displayed in the console.
	 *
	 * @throws Will throw an error if yt-dlp is not installed or not in PATH, or if any other error occurs during the execution of yt-dlp.
	 *
	 * @example
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 *  .resolution("720p")
	 *  .output("downloads/%(title)s.%(ext)s")
	 *  .run();
	 *
	 */
	async run(): Promise<void> {
		const args = this.buildArgs();
		await runYtDlp([...args, this.url]);
	}
}
