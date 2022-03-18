import { MutableRef } from "preact/hooks"
import { Context } from "../api/context"
import { getPluginsFor, Plugin } from "../core/plugins"
import { Map } from "ol"

export type PluginsContainerProps = {
    context: Context
    map: MutableRef<Map | null>
    plugins: Plugin[]
    allPlugins: Plugin[]
}

export default function PluginsContainer({
    plugins,
    allPlugins,
    context,
    map,
}: PluginsContainerProps) {
    return (
        <>
            {plugins.map((p) => (
                <p.plugin
                    context={context}
                    cfg={p.cfg}
                    map={map}
                    allPlugins={allPlugins}
                    plugins={getPluginsFor(p.name, allPlugins)}
                />
            ))}
        </>
    )
}
