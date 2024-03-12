import { searchYoutube, spotifyApi } from "/modules/Delusoire/delulib/lib/api.js";
import { _ } from "/modules/Delusoire/stdlib/deps.js";
import { normalizeStr } from "/modules/Delusoire/delulib/lib/util.js";

// import { Innertube, UniversalCache } from "https://esm.sh/youtubei.js/web.bundle.min";
// const yt = await Innertube.create({
// 	cache: new UniversalCache(false),
// 	fetch: (url, init) => {
// 		return fetch(url, init);
// 	},
// });

import { S } from "/modules/Delusoire/stdlib/index.js";
import { CONFIG } from "./settings.js";

const { URI } = S;

const YTVidIDCache = new Map<string, string>();

export const showOnYouTube = async (uri: string) => {
	const id = URI.fromString(uri).id;
	if (!YTVidIDCache.get(id)) {
		const track = await spotifyApi.tracks.get(id);
		const artists = track.artists.map(artist => artist.name);
		const nonFeatArtists = artists.filter(artist => !track.name.includes(artist));
		const searchString = `${nonFeatArtists.join(", ")} - ${track.name} [Official Music Video]`;

		try {
			const videos = await searchYoutube(CONFIG.YouTubeApiKey, searchString).then(res => res.items);
			const normalizedTrackName = normalizeStr(track.name);

			const video =
				videos.find(video => {
					normalizeStr(video.snippet.title).includes(normalizedTrackName);
				}) ?? videos[0];

			YTVidIDCache.set(id, video.id.videoId);

			window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`);
		} catch (_) {
			window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchString)}`);
		}
	}
};
