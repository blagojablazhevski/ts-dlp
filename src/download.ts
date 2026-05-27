import {runYtDlp} from "./internal/runner.js";

export class DownloadBuilder {
	private readonly args: string[] = [];

	constructor(private readonly url: string) {}

	/**
	 * Set the desired resolution for the video to be downloaded.
	 * This will instruct yt-dlp to download the best video and audio streams that are less than or equal to the specified height.
	 * For example, if you specify "720p", yt-dlp will download the best video and audio streams that are 720 pixels in height or less.
	 * If you want to download the best available quality regardless of resolution, you can omit this option or set it to a very high value like "9999p".
	 *
	 * @example
	 * download("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
	 *   .resolution("720p")
	 *   .output("downloads/%(title)s.%(ext)s")
	 *
	 * @param res The desired resolution for the video. For example: "720p", "1080p", etc. This will tell yt-dlp to download the best video and audio streams that are less than or equal to the specified height. If you want to download the best available quality, you can omit this option or set it to a very high value like "9999p".
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	resolution(res: string): this {
		const height = res.replace("p", "");
		this.args.push(
			"-f",
			`bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`,
		);
		return this;
	}

	/**
	 * Set the output directory and filename template for the downloaded file.
	 *
	 * @param template The output template for the downloaded file. You can use placeholders like %(title)s, %(ext)s, etc. For example: "downloads/%(title)s.%(ext)s"
	 * @returns The current instance of DownloadBuilder for method chaining.
	 */
	output(template: string): this {
		this.args.push("-o", template);
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
		await runYtDlp([...this.args, this.url]);
	}
}
