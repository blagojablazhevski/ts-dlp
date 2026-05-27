import {execa, ExecaError} from "execa";

try {
	await execa("yt-dlp", ["--version"], {
		stdio: "inherit",
	});
} catch (error) {
	if (error instanceof ExecaError && error.code === "ENOENT") {
		console.error(
			"yt-dlp is not installed or not in PATH. Please refer to https://github.com/yt-dlp/yt-dlp#installation",
		);
		process.exit(1);
	}
	throw error;
}
