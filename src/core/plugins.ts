import { JSX } from "preact"
import { MapStorePlugin, MapStorePluginDef } from "../api/context"
import { PluginsContainerProps } from "../viewer/plugins-container"

export type PluginProps = PluginsContainerProps & {
    cfg: unknown
}

export type PluginImpl = (props: PluginProps) => JSX.Element | null

export type Plugin = {
    name: string
    plugin: PluginImpl
    cfg: unknown
    container?: string
}

export function getPlugins(plugins: MapStorePluginDef[]): Promise<Plugin[]> {
    return Promise.all(
        plugins.map((plugin) => {
            const pluginDef = normalizePlugin(plugin)
            return import(`../plugins/${pluginDef.name.toLowerCase()}.tsx`)
                .then((impl) => ({
                    name: pluginDef.name.toLowerCase(),
                    plugin: impl.default as PluginImpl,
                    cfg: pluginDef.cfg,
                    container: impl.container,
                }))
                .catch(() => {
                    console.error(`plugin ${pluginDef.name} not implemented`)
                    return {
                        name: pluginDef.name.toLowerCase(),
                        plugin: (() => null) as PluginImpl,
                        cfg: pluginDef.cfg,
                    }
                })
        })
    ).then((pluginImpls) => pluginImpls.filter((p) => p))
}

export function getPluginsFor(
    container: string | undefined,
    plugins: Plugin[]
) {
    if (container) {
        return plugins.filter((p) => p.container === container)
    }
    return []
}

function normalizePlugin(plugin: MapStorePluginDef): MapStorePlugin {
    if (typeof plugin === "string") {
        return { name: plugin }
    }
    return plugin
}
