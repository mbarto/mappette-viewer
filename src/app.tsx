import { useContext } from "./api/context"
import ContextViewer from "./viewer/context-viewer"

export function App() {
    const { context, error, mode } = useContext()
    if (error) return <div className="error">{error}</div>
    if (context)
        return <ContextViewer context={context} mapType={getMapType(mode)} />
    return <div className="loading">Loading...</div>
}
function getMapType(mode: string): string {
    return mode === "3d" ? "cesium" : "ol"
}
