import { useContext } from "./api/context"
import ContextPrinter from "./printer/context-printer"

export function Print() {
    const { context, error } = useContext()
    if (error) return <div className="error">{error}</div>
    if (context) return <ContextPrinter context={context} />
    return <div className="loading">Loading...</div>
}
