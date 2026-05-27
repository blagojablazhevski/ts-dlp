type Resolution =
	| "144p"
	| "240p"
	| "360p"
	| "480p"
	| "720p"
	| "1080p"
	| "1440p"
	| "2160p"
	| (string & {});

type OutputFields = {
	title: string;
	ext: string;
	id: string;
	uploader: string;
	uploader_id: string;
	channel: string;
	upload_date: string;
	release_date: string;
	epoch: string;
	height: string;
	width: string;
	resolution: string;
	fps: string;
	vcodec: string;
	acodec: string;
	duration_string: string;
	playlist_title: string;
	playlist_index: string;
	autonumber: string;
};
export type {Resolution, OutputFields};
