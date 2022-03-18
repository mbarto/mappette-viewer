import { useEffect, useRef, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { getPlugins, Plugin } from "../core/plugins"
import OLMap from "ol/Map"
import { Map } from "../core/map"
import { loadLocale, Locale } from "../api/locale"
import PluginsContainer from "./plugins-container"

type ContextViewerProps = {
    context: Context
    env?: string
}

export default function ContextViewer({
    context,
    env = "desktop",
}: ContextViewerProps) {
    const map = useRef<OLMap | null>(null)

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
                    />
                </Map.Provider>
            </Locale.Provider>
        </div>
    )
}
