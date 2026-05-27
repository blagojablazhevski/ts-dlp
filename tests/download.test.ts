import {describe, it, expect, vi, beforeEach} from "vitest";
import {download} from "../src/index.js";
import {DownloadBuilder} from "../src/download.js";
import {env} from "./env.js";

vi.mock("../src/internal/runner.js", () => ({
	runYtDlp: vi.fn().mockResolvedValue(undefined),
}));

const {TEST_URL} = env;

async function getRunYtDlp() {
	const {runYtDlp} = await import("../src/internal/runner.js");
	return vi.mocked(runYtDlp);
}

describe("download()", () => {
	it("returns a DownloadBuilder for a valid URL", () => {
		expect(download(TEST_URL)).toBeInstanceOf(DownloadBuilder);
	});

	it("throws TypeError for an invalid URL string", () => {
		expect(() => download("not-a-url")).toThrow(TypeError);
		expect(() => download("not-a-url")).toThrow("Invalid URL");
	});

	it("throws TypeError for an empty string", () => {
		expect(() => download("")).toThrow(TypeError);
	});
});

describe("DownloadBuilder - format flag", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passes no -f flag when no format options are set", async () => {
		await download(TEST_URL).run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([TEST_URL]);
	});

	it("produces the correct -f flag for resolution only", async () => {
		await download(TEST_URL).resolution("1080p").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo[height<=1080]+bestaudio/best",
			TEST_URL,
		]);
	});

	it("produces the correct -f flag for fps only", async () => {
		await download(TEST_URL).fps(60).run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo[fps<=60]+bestaudio/best",
			TEST_URL,
		]);
	});

	it("produces the correct -f flag for format only", async () => {
		await download(TEST_URL).format("mp4").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo[ext=mp4]+bestaudio/best",
			TEST_URL,
		]);
	});

	it("produces the correct -f flag for audio codec", async () => {
		await download(TEST_URL).audio("mp3").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo+bestaudio[ext=mp3]/best",
			TEST_URL,
		]);
	});

	it("uses bestaudio when audio() is called with no codec", async () => {
		await download(TEST_URL).audio().run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo+bestaudio/best",
			TEST_URL,
		]);
	});

	it("combines resolution, fps, and format into one filter", async () => {
		await download(TEST_URL).resolution("720p").fps(30).format("mp4").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo[height<=720][fps<=30][ext=mp4]+bestaudio/best",
			TEST_URL,
		]);
	});

	it("combines resolution and audio codec", async () => {
		await download(TEST_URL).resolution("1080p").audio("aac").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-f",
			"bestvideo[height<=1080]+bestaudio[ext=aac]/best",
			TEST_URL,
		]);
	});
});

describe("DownloadBuilder - output flag", () => {
	beforeEach(() => vi.clearAllMocks());

	it("adds default filename template when only output dir is set", async () => {
		await download(TEST_URL).output("downloads").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-o",
			"downloads/%(title)s.%(ext)s",
			TEST_URL,
		]);
	});

	it("uses a string filename template without an output dir", async () => {
		await download(TEST_URL).filename("%(uploader)s.%(ext)s").run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-o",
			"%(uploader)s.%(ext)s",
			TEST_URL,
		]);
	});

	it("combines output dir with a string filename template", async () => {
		await download(TEST_URL)
			.output("downloads")
			.filename("%(title)s.%(ext)s")
			.run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-o",
			"downloads/%(title)s.%(ext)s",
			TEST_URL,
		]);
	});

	it("maps callback fields to yt-dlp template placeholders via Proxy", async () => {
		await download(TEST_URL)
			.output("downloads")
			.filename(({title, ext}) => `${title}.${ext}`)
			.run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-o",
			"downloads/%(title)s.%(ext)s",
			TEST_URL,
		]);
	});

	it("maps multiple callback fields correctly", async () => {
		await download(TEST_URL)
			.filename(({uploader, title, ext}) => `${uploader} - ${title}.${ext}`)
			.run();
		expect((await getRunYtDlp()).mock.calls[0]![0]).toEqual([
			"-o",
			"%(uploader)s - %(title)s.%(ext)s",
			TEST_URL,
		]);
	});
});

describe("DownloadBuilder.fps() validation", () => {
	it("throws RangeError for fps of 0", () => {
		expect(() => download(TEST_URL).fps(0)).toThrow(RangeError);
	});

	it("throws RangeError for a negative fps", () => {
		expect(() => download(TEST_URL).fps(-1)).toThrow(RangeError);
	});

	it("throws RangeError for a non-integer fps", () => {
		expect(() => download(TEST_URL).fps(1.5)).toThrow(RangeError);
	});

	it("does not throw for fps of 30", () => {
		expect(() => download(TEST_URL).fps(30)).not.toThrow();
	});

	it("returns the builder instance for chaining", () => {
		const builder = download(TEST_URL);
		expect(builder.fps(60)).toBe(builder);
	});
});
