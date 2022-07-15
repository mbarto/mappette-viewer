import { useEffect, useState } from "preact/hooks"
import { Context } from "../api/context-types"
import { addPlugins, getPlugins, Plugin } from "../core/plugins"
import { Map, MapInstance } from "../core/map"
import PluginsContainer from "./plugins-container"
import "./context-viewer/context-viewer.css"

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
    useEffect(() => {
        if (context.windowTitle) {
            document.title = context.windowTitle
        }
        addPlugins(context.plugins[env], (plugin: Plugin) => {
            setContextPlugins((plugins) => [...plugins, plugin])
        })
    }, [context])
    return (
        <div id="viewer">
            <Map.Provider value={map}>
                <PluginsContainer
                    allPlugins={contextPlugins}
                    plugins={contextPlugins.filter((p) => !p.container)}
                    context={context}
                    mapType={mapType}
                    setMap={setMap}
                />
            </Map.Provider>
        </div>
    )
}
