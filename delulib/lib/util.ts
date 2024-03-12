import { S } from "/modules/Delusoire/stdlib/index.js";

const PlayerAPI = S.Platform.getPlayerAPI();

export const SpotifyLoc = {
	before: {
		start: () => ({ before: "start" as const }),
		fromUri: (uri: string) => ({ before: { uri } }),
		fromUid: (uid: string) => ({ before: { uid } }),
	},
	after: {
		end: () => ({ after: "end" as const }),
		fromUri: (uri: string) => ({ after: { uri } }),
		fromUid: (uid: string) => ({ after: { uid } }),
	},
};

export const normalizeStr = (str: string) =>
	str
		.normalize("NFKD")
		.replace(/\(.*\)/g, "")
		.replace(/\[.*\]/g, "")
		.replace(/-_,/g, " ")
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/\s+/g, " ")
		.toLowerCase()
		.trim();

export class PermanentMutationObserver extends MutationObserver {
	target: HTMLElement | null = null;

	constructor(
		targetSelector: string,
		callback: MutationCallback,
		opts: MutationObserverInit = {
			childList: true,
			subtree: true,
		},
	) {
		super(callback);
		new MutationObserver(() => {
			const nextTarget = document.querySelector<HTMLElement>(targetSelector);
			if (nextTarget && !nextTarget.isEqualNode(this.target)) {
				this.target && this.disconnect();
				this.target = nextTarget;
				this.observe(this.target, opts);
			}
		}).observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createQueueItem =
	(queued: boolean) =>
	({ uri, uid = "" }: { uri: string; uid?: string }) => ({
		contextTrack: {
			uri,
			uid,
			metadata: {
				is_queued: queued.toString(),
			},
		},
		removed: [],
		blocked: [],
		provider: queued ? ("queue" as const) : ("context" as const),
	});

export const setQueue = async (nextTracks: Array<ReturnType<ReturnType<typeof createQueueItem>>>, contextUri?: string) => {
	const { _queue, _client } = PlayerAPI._queue;
	const { prevTracks, queueRevision } = _queue;

	const res = await _client.setQueue({
		nextTracks,
		prevTracks,
		queueRevision,
	});

	await PlayerAPI.skipToNext();

	if (contextUri) {
		await new Promise<void>(resolve => {
			PlayerAPI.getEvents().addListener("queue_update", () => resolve(), { once: true });
		});
		await setPlayingContext(contextUri);
	}

	return res;
};

export const setPlayingContext = (uri: string) => {
	const { sessionId } = PlayerAPI._state;
	return PlayerAPI.updateContext(sessionId, { uri, url: `context://${uri}` });
};

export const getSongPositionMs = (item = PlayerAPI.getState().item) => {
	if (item === null) return null;
	const { positionAsOfTimestamp, timestamp, duration, speed, hasContext, isPaused, isBuffering } = item;
	if (!positionAsOfTimestamp || !duration) return null;
	if (!hasContext || isPaused || isBuffering) return positionAsOfTimestamp;
	const scaledTimeSinceTimestamp = (Date.now() - timestamp) * (speed ?? 0);
	return Math.min(positionAsOfTimestamp + scaledTimeSinceTimestamp, duration);
};
