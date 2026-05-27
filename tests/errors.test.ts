import {describe, it, expect} from "vitest";
import {YtDlpError, YtDlpNotFoundError} from "../src/errors.js";

describe("YtDlpNotFoundError", () => {
	it("is an instance of Error", () => {
		expect(new YtDlpNotFoundError()).toBeInstanceOf(Error);
	});

	it("has the correct name", () => {
		expect(new YtDlpNotFoundError().name).toBe("YtDlpNotFoundError");
	});

	it("includes the yt-dlp install URL in the message", () => {
		expect(new YtDlpNotFoundError().message).toContain(
			"https://github.com/yt-dlp/yt-dlp#installation",
		);
	});
});

describe("YtDlpError", () => {
	it("is an instance of Error", () => {
		expect(new YtDlpError("failed", 1, "stderr output")).toBeInstanceOf(Error);
	});

	it("has the correct name", () => {
		expect(new YtDlpError("failed", 1, "").name).toBe("YtDlpError");
	});

	it("exposes the exit code", () => {
		expect(new YtDlpError("failed", 2, "").exitCode).toBe(2);
	});

	it("exposes stderr", () => {
		expect(new YtDlpError("failed", 1, "some error output").stderr).toBe(
			"some error output",
		);
	});

	it("sets the message", () => {
		expect(new YtDlpError("download failed", 1, "").message).toBe(
			"download failed",
		);
	});
});
