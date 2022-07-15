import { useContext } from "./api/context/context"
import { Locale, useLocalizedMessages } from "./api/locale"
import ContextPrinter from "./printer/context-printer"

export function Print() {
    const { context, error } = useContext()
    const { messages, error: localeError } = useLocalizedMessages()
    if (error) return <div className="error">{error}</div>
    if (localeError) return <div className="error">{localeError}</div>
    if (context && messages)
        return (
            <Locale.Provider value={messages}>
                <ContextPrinter context={context} />
            </Locale.Provider>
        )
    return <div className="loading">Loading...</div>
}
