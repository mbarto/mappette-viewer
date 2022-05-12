import { useEffect, useState } from "preact/hooks"
import { Context, loadContext } from "./api/context"
import ContextViewer from "./viewer/context-viewer"

export function App() {
    const url = new URL(window.location.href)
    const contextName = url.searchParams.get("context") ?? "config.json"
    const local = contextName === "config.json"
    const mode = url.searchParams.get("mode") ?? "2d"
    const [context, setContext] = useState<Context | null>(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        if (contextName) {
            loadContext(contextName, local)
                .then(setContext)
                .catch((e) => setError(e?.message || "Unknown error"))
        }
    }, [contextName])
    return contextName ? (
        <>
            {error ? (
                <div className="error">{error}</div>
            ) : context ? (
                <ContextViewer context={context} mapType={getMapType(mode)} />
            ) : (
                <div className="loading">Loading...</div>
            )}
        </>
    ) : (
        <>
            <div className="error">
                No context specified in url: {window.location.href}
                <br />
                Try with {window.location.href}?context=&lt;context to load&gt;
            </div>
        </>
    )
}
function getMapType(mode: string): string {
    return mode === "3d" ? "cesium" : "ol"
}
