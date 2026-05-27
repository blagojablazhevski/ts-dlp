import {describe, it, expect, vi, beforeEach} from "vitest";
import {ExecaError} from "execa";
import {YtDlpError, YtDlpNotFoundError} from "../src/errors.js";

vi.mock("execa", async (importOriginal) => {
	const actual = await importOriginal<typeof import("execa")>();
	return {...actual, execa: vi.fn()};
});

function makeExecaError(
	overrides: Partial<{
		code: string;
		exitCode: number;
		stderr: string;
	}> = {},
): ExecaError {
	const error = Object.create(ExecaError.prototype) as ExecaError;
	return Object.assign(error, {exitCode: 1, stderr: "", ...overrides});
}

async function getRunner() {
	return import("../src/internal/runner.js");
}

describe("runYtDlp()", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("resolves with stdout and stderr when execa succeeds", async () => {
		const {execa} = await import("execa");
		vi.mocked(execa).mockResolvedValue({stdout: "out", stderr: "err"} as never);
		const {runYtDlp} = await getRunner();
		await expect(runYtDlp(["--some-flag"])).resolves.toEqual({
			stdout: "out",
			stderr: "err",
		});
	});

	it("passes --js-runtimes node and the provided args to execa with stdio inherit by default", async () => {
		const {execa} = await import("execa");
		vi.mocked(execa).mockResolvedValue({stdout: "", stderr: ""} as never);
		const {runYtDlp} = await getRunner();
		await runYtDlp(["--foo", "bar"]);
		expect(execa).toHaveBeenCalledWith(
			"yt-dlp",
			["--js-runtimes", "node", "--foo", "bar"],
			expect.objectContaining({stdio: "inherit"}),
		);
	});

	it("uses stdio pipe when pipe=true", async () => {
		const {execa} = await import("execa");
		vi.mocked(execa).mockResolvedValue({stdout: "captured", stderr: ""} as never);
		const {runYtDlp} = await getRunner();
		const result = await runYtDlp(["--foo"], true);
		expect(execa).toHaveBeenCalledWith(
			"yt-dlp",
			["--js-runtimes", "node", "--foo"],
			expect.objectContaining({stdio: "pipe"}),
		);
		expect(result).toEqual({stdout: "captured", stderr: ""});
	});

	it("throws YtDlpNotFoundError when execa rejects with ENOENT", async () => {
		const {execa} = await import("execa");
		vi.mocked(execa).mockRejectedValue(makeExecaError({code: "ENOENT"}));
		const {runYtDlp} = await getRunner();
		await expect(runYtDlp([])).rejects.toBeInstanceOf(YtDlpNotFoundError);
	});

	it("throws YtDlpError with correct exitCode and stderr on non-zero exit", async () => {
		const {execa} = await import("execa");
		vi.mocked(execa).mockRejectedValue(
			makeExecaError({exitCode: 1, stderr: "some error output"}),
		);
		const {runYtDlp} = await getRunner();
		const error = await runYtDlp([]).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(YtDlpError);
		expect((error as YtDlpError).exitCode).toBe(1);
		expect((error as YtDlpError).stderr).toBe("some error output");
	});

	it("rethrows non-ExecaError errors as-is", async () => {
		const {execa} = await import("execa");
		const original = new Error("unexpected failure");
		vi.mocked(execa).mockRejectedValue(original);
		const {runYtDlp} = await getRunner();
		await expect(runYtDlp([])).rejects.toBe(original);
	});
});
