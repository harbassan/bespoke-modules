import { S, SVGIcons, createStorage, createRegistrar, createLogger, createEventBus } from "/modules/Delusoire/stdlib/index.js";
import { createSettings } from "/modules/Delusoire/stdlib/lib/settings.js";
import { NavLink } from "/modules/Delusoire/stdlib/src/registers/navlink.js";
import { ACTIVE_ICON, ICON } from "./static.js";
import PlaylistPage from "./pages/playlist.js";
import { display } from "/modules/Delusoire/stdlib/lib/modal.js";
import { Button } from "/modules/Delusoire/stdlib/src/registers/topbarLeftButton.js";
const { React, URI } = S;
const History = S.Platform.getHistory();
export let storage = undefined;
export let logger = undefined;
export let settings = undefined;
export let settingsButton = undefined;
export default function(mod) {
    storage = createStorage(mod);
    logger = createLogger(mod);
    [settings, settingsButton] = createSettings(mod);
    const eventBus = createEventBus(mod);
    const registrar = createRegistrar(mod);
    let setPlaylistEditHidden = undefined;
    const PlaylistEdit = ()=>{
        const [hidden, setHidden] = React.useState(true);
        setPlaylistEditHidden = setHidden;
        if (hidden) return;
        return /*#__PURE__*/ S.React.createElement(Button, {
            label: "playlist-stats",
            icon: SVGIcons.visualizer,
            onClick: ()=>{
                const playlistUri = URI.fromString(History.location.pathname).toURI();
                display({
                    title: "Playlist Stats",
                    content: /*#__PURE__*/ S.React.createElement(PlaylistPage, {
                        uri: playlistUri
                    }),
                    isLarge: true
                });
            }
        });
    };
    eventBus.History.updated.subscribe(({ pathname })=>{
        const isPlaylistPage = URI.is.PlaylistV1OrV2(pathname);
        setPlaylistEditHidden?.(!isPlaylistPage);
    });
    registrar.register("topbarLeftButton", /*#__PURE__*/ S.React.createElement(PlaylistEdit, null));
    const LazyStatsApp = S.React.lazy(()=>import("./app.js"));
    registrar.register("route", /*#__PURE__*/ S.React.createElement(S.ReactComponents.Route, {
        path: "/stats/*",
        element: /*#__PURE__*/ S.React.createElement(LazyStatsApp, null)
    }));
    registrar.register("navlink", ()=>/*#__PURE__*/ S.React.createElement(NavLink, {
            localizedApp: "Statistics",
            appRoutePath: "/stats",
            icon: ICON,
            activeIcon: ACTIVE_ICON
        }));
}