import {execa, ExecaError} from "execa";
import {YtDlpError, YtDlpNotFoundError} from "../errors.js";

export interface RunResult {
	stdout: string;
	stderr: string;
}

export async function runYtDlp(
	args: string[],
	pipe = false,
): Promise<RunResult> {
	const result = await execa(
		"yt-dlp",
		["--js-runtimes", "node", ...args],
		{stdio: pipe ? "pipe" : "inherit"},
	).catch(handleError);
	return {
		stdout: result.stdout ?? "",
		stderr: result.stderr ?? "",
	};
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
