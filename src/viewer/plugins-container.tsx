import { DomainContext } from "../api/context/context-domain-types"
import { MapInstance } from "../core/map"
import { getPluginsFor, Plugin } from "../core/plugins"

export type PluginsContainerProps = {
    context: DomainContext
    plugins: Plugin[]
    allPlugins: Plugin[]
    mapType: string
    setMap: (map: MapInstance) => void
}

export default function PluginsContainer({
    plugins,
    allPlugins,
    context,
    mapType,
    setMap,
}: PluginsContainerProps) {
    return (
        <>
            {plugins.map((p) => (
                <p.plugin
                    context={context}
                    cfg={p.cfg}
                    allPlugins={allPlugins}
                    plugins={getPluginsFor(p.name, allPlugins)}
                    mapType={mapType}
                    setMap={setMap}
                />
            ))}
        </>
    )
}
