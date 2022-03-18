import { Context } from "../api/context"
import { getPluginsFor, Plugin } from "../core/plugins"

export type PluginsContainerProps = {
    context: Context
    plugins: Plugin[]
    allPlugins: Plugin[]
}

export default function PluginsContainer({
    plugins,
    allPlugins,
    context,
}: PluginsContainerProps) {
    return (
        <>
            {plugins.map((p) => (
                <p.plugin
                    context={context}
                    cfg={p.cfg}
                    allPlugins={allPlugins}
                    plugins={getPluginsFor(p.name, allPlugins)}
                />
            ))}
        </>
    )
}
