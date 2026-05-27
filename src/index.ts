import {DownloadBuilder} from "./download.js";

export {YtDlpError, YtDlpNotFoundError} from "./errors.js";
export type {Resolution, AudioCodec, VideoExt, OutputFields} from "./types.js";

export function download(url: string): DownloadBuilder {
	return new DownloadBuilder(url);
}
