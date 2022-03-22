import { useEffect, useRef, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { getPlugins, Plugin } from "../core/plugins"
import { Map, MapInstance, MapProvider } from "../core/map"
import { loadLocale, Locale } from "../api/locale"
import PluginsContainer from "./plugins-container"

type ContextViewerProps = {
    context: Context
    mapType?: string
    env?: string
}

export default function ContextViewer({
    context,
    mapType = "ol",
    env = "desktop",
}: ContextViewerProps) {
    const [map, setMap] = useState<MapInstance | null>(null)

    const [contextPlugins, setContextPlugins] = useState<Plugin[]>([])
    const [locale, setLocale] = useState<Locale | undefined>()
    useEffect(() => {
        if (context.windowTitle) {
            document.title = context.windowTitle
        }
        getPlugins(context.plugins[env]).then(setContextPlugins)
        loadLocale().then(setLocale)
    }, [context])
    return (
        <div id="viewer">
            <Locale.Provider value={locale}>
                <Map.Provider value={map}>
                    <PluginsContainer
                        allPlugins={contextPlugins}
                        plugins={contextPlugins.filter((p) => !p.container)}
                        context={context}
                        mapType={mapType}
                        setMap={setMap}
                    />
                </Map.Provider>
            </Locale.Provider>
        </div>
    )
}
