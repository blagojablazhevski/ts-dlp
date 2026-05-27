import {execa, ExecaError} from "execa";

export async function runYtDlp(args: string[]): Promise<void> {
	await execa("yt-dlp", ["--js-runtimes", "node", ...args], {
		stdio: "inherit",
	}).catch(handleEnoent);
}

export function handleEnoent(error: unknown): never {
	if (error instanceof ExecaError && error.code === "ENOENT") {
		throw new Error(
			"yt-dlp is not installed or not in PATH. Please refer to https://github.com/yt-dlp/yt-dlp#installation",
		);
	}
	throw error;
}
