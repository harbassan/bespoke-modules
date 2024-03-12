import { updateCollectionControls, updateNowPlayingControls, updateTrackControls } from "./controls.js";
import { loadRatings } from "./util.js";
import { CONFIG } from "./settings.js";
import { _ } from "/modules/Delusoire/stdlib/deps.js";
import { onHistoryChanged, onTrackListMutationListeners } from "/modules/Delusoire/delulib/lib/listeners.js";
import { Events, SVGIcons } from "/modules/Delusoire/stdlib/index.js";
import { S } from "/modules/Delusoire/stdlib/index.js";
import { useMenuItem } from "/modules/Delusoire/stdlib/src/registers/menu.js";
import { createIconComponent } from "/modules/Delusoire/stdlib/lib/createIconComponent.js";
const { URI } = S;
globalThis.tracksRatings || (globalThis.tracksRatings = {});
globalThis.playlistUris || (globalThis.playlistUris = []);
const PlayerAPI = S.Platform.getPlayerAPI();
loadRatings();
Events.Player.songchanged.on(state => {
	if (!state) return;
	const { uri } = state.item ?? {};
	if (!uri) return;
	if (Number(CONFIG.skipThreshold)) {
		const currentTrackRating = tracksRatings[uri] ?? Number.MAX_SAFE_INTEGER;
		if (currentTrackRating <= Number(CONFIG.skipThreshold)) return void PlayerAPI.skipToNext();
	}
	updateNowPlayingControls(uri);
});
onTrackListMutationListeners.push(async (_, tracks) => {
	for (const track of tracks) updateTrackControls(track, track.props.uri);
});
onHistoryChanged(_.overSome([URI.is.Album, URI.is.Artist, URI.is.PlaylistV1OrV2]), uri => updateCollectionControls(uri));
export const FolderPickerMenuItem = () => {
	const { props } = useMenuItem();
	const { uri } = props.reference;
	return /*#__PURE__*/ S.React.createElement(
		S.ReactComponents.MenuItem,
		{
			disabled: false,
			onClick: () => {
				CONFIG.ratingsFolderUri = uri;
			},
			leadingIcon: createIconComponent({
				icon: SVGIcons["playlist-folder"],
			}),
		},
		"Choose for Ratings Playlists",
	);
};
