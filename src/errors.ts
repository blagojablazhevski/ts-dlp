export class YtDlpNotFoundError extends Error {
	constructor() {
		super(
			"yt-dlp is not installed or not in PATH. Refer to https://github.com/yt-dlp/yt-dlp#installation",
		);
		this.name = "YtDlpNotFoundError";
	}
}

export class YtDlpError extends Error {
	constructor(
		message: string,
		public readonly exitCode: number,
		public readonly stderr: string,
	) {
		super(message);
		this.name = "YtDlpError";
	}
}
