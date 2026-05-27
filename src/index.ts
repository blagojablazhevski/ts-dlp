import {DownloadBuilder} from "./download.js";

export {YtDlpError, YtDlpNotFoundError} from "./errors.js";
export type {Resolution, AudioCodec, VideoExt, OutputFields} from "./types.js";
export type {RunResult} from "./internal/runner.js";

export function download(url: string): DownloadBuilder {
	return new DownloadBuilder(url);
}
