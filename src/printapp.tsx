import { useEffect, useState } from "preact/hooks"
import { Context, loadContext } from "./api/context"
import ContextPrinter from "./printer/context-printer"

export function Print() {
    const url = new URL(window.location.href)
    const contextName = url.searchParams.get("context")
    const [context, setContext] = useState<Context | null>(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        if (contextName) {
            loadContext(contextName).then(setContext).catch(setError)
        }
    }, [contextName])
    return contextName ? (
        <>
            {error ? (
                <div className="error">{JSON.stringify(error)}</div>
            ) : context ? (
                <ContextPrinter context={context} />
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
