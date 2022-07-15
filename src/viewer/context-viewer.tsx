import { useEffect, useState } from "preact/hooks"
import { addPlugins, Plugin } from "../core/plugins"
import { Map, MapInstance } from "../core/map"
import PluginsContainer from "./plugins-container"
import "./context-viewer/context-viewer.css"
import { DomainContext } from "../api/context/context-domain-types"

type ContextViewerProps = {
    context: DomainContext
    mapType?: string
}

export default function ContextViewer({
    context,
    mapType = "ol",
}: ContextViewerProps) {
    const [map, setMap] = useState<MapInstance | null>(null)

    const [contextPlugins, setContextPlugins] = useState<Plugin[]>([])
    useEffect(() => {
        if (context.windowTitle) {
            document.title = context.windowTitle
        }
        addPlugins(context.plugins, (plugin: Plugin) => {
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
