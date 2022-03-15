import { useEffect, useRef, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { getPlugins, getPluginsFor, Plugin } from "../core/plugins"
import OLMap from "ol/Map"

type ContextViewerProps = {
    context: Context
    env?: string
}

export default function ContextViewer({
    context,
    env = "desktop",
}: ContextViewerProps) {
    const map = useRef<OLMap | null>(null)
    function renderPlugins(contextPlugins: Plugin[]) {
        return contextPlugins
            .filter((p) => !p.container)
            .map((p) => (
                <p.plugin
                    context={context}
                    cfg={p.cfg}
                    map={map}
                    plugins={getPluginsFor(p.name, contextPlugins)}
                />
            ))
    }

    const [contextPlugins, setContextPlugins] = useState<Plugin[]>([])
    useEffect(() => {
        if (context.windowTitle) {
            document.title = context.windowTitle
        }
        getPlugins(context.plugins[env]).then(setContextPlugins)
    }, [context])
    return <div id="viewer">{renderPlugins(contextPlugins)}</div>
}
