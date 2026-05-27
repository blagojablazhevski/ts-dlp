import {execa, ExecaError} from "execa";
import {YtDlpError, YtDlpNotFoundError} from "../errors.js";

export async function runYtDlp(args: string[]): Promise<void> {
	await execa("yt-dlp", ["--js-runtimes", "node", ...args], {
		stdio: "inherit",
	}).catch(handleError);
}

function handleError(error: unknown): never {
	if (error instanceof ExecaError) {
		if (error.code === "ENOENT") {
			throw new YtDlpNotFoundError();
		}
		throw new YtDlpError(
			`yt-dlp exited with code ${error.exitCode}`,
			error.exitCode ?? 1,
			error.stderr ?? "",
		);
	}
	throw error;
}
