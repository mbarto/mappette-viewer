import { useEffect, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { getPlugins, Plugin } from "../core/plugins"

type ContextViewerProps = {
    context: Context
    env?: string
}

export default function ContextViewer({
    context,
    env = "desktop",
}: ContextViewerProps) {
    function renderPlugins(contextPlugins: Plugin[]) {
        return contextPlugins.map((p) => (
            <p.plugin context={context} cfg={p.cfg} />
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
