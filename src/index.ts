import {DownloadBuilder} from "./download.js";

export function download(url: string): DownloadBuilder {
	return new DownloadBuilder(url);
}
