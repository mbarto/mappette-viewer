import { JSX } from "preact"
import { Context, MapStorePlugin, MapStorePluginDef } from "../api/context"

export type PluginProps = {
    cfg: unknown
    context: Context
}

export type PluginImpl = (props: PluginProps) => JSX.Element | null

export type Plugin = {
    plugin: PluginImpl
    cfg: unknown
}

export function getPlugins(plugins: MapStorePluginDef[]): Promise<Plugin[]> {
    return Promise.all(
        plugins.map((plugin) => {
            const pluginDef = normalizePlugin(plugin)
            return import(`../plugins/${pluginDef.name.toLowerCase()}`)
                .then((impl) => ({
                    plugin: impl.default as PluginImpl,
                    cfg: pluginDef.cfg,
                }))
                .catch(() => {
                    console.error(`plugin ${pluginDef.name} not implemented`)
                    return {
                        plugin: (() => null) as PluginImpl,
                        cfg: pluginDef.cfg,
                    }
                })
        })
    ).then((pluginImpls) => pluginImpls.filter((p) => p))
}
function normalizePlugin(plugin: MapStorePluginDef): MapStorePlugin {
    if (typeof plugin === "string") {
        return { name: plugin }
    }
    return plugin
}
