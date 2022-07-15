import { useContext } from "./api/context/context"
import { Locale, useLocalizedMessages } from "./api/locale"
import ContextViewer from "./viewer/context-viewer"

export function App() {
    const { context, error, mode } = useContext()
    const { messages, error: localeError } = useLocalizedMessages()
    if (error) return <div className="error">{error}</div>
    if (localeError) return <div className="error">{localeError}</div>
    if (context && messages)
        return (
            <Locale.Provider value={messages}>
                <ContextViewer context={context} mapType={getMapType(mode)} />
            </Locale.Provider>
        )
    return <div className="loading">Loading...</div>
}
function getMapType(mode: string): string {
    return mode === "3d" ? "cesium" : "ol"
}
