import { MutableRef } from "preact/hooks"
import { Context } from "../api/context"
import { PluginProps, getPluginsFor, Plugin } from "../core/plugins"
import Map from "ol/Map"
import "./toolbar.css"

type ToolbarPluginProps = PluginProps

function renderPlugins({ plugins, context, map }: ToolbarPluginProps) {
    return plugins.map((p) => (
        <p.plugin
            context={context}
            cfg={p.cfg}
            map={map}
            plugins={getPluginsFor(p.name, plugins)}
        />
    ))
}

export default function Toolbar(props: ToolbarPluginProps) {
    return <div id="toolbar">{renderPlugins(props)}</div>
}
