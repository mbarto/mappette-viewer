import { useStory } from "./api/story"
import { Locale, useLocalizedMessages } from "./api/locale"
import StoryViewer from "./viewer/story-viewer"

export function Story() {
    const { story, error } = useStory()
    const { messages, error: localeError } = useLocalizedMessages()
    if (error) return <div className="error">{error}</div>
    if (localeError) return <div className="error">{localeError}</div>
    if (story && messages)
        return (
            <Locale.Provider value={messages}>
                <StoryViewer story={story} />
            </Locale.Provider>
        )
    return <div className="loading">Loading...</div>
}
