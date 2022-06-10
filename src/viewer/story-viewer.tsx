import { Story, useSectionType } from "../api/story"
import { getStoryTheme } from "../api/theme"
import "./story-viewer/story.css"

type StoryViewerProps = {
    story: Story
}

export default function StoryViewer({ story }: StoryViewerProps) {
    return (
        <div id="page-story" className="page page-geostory">
            <div id="geostory-navigation"></div>
            <main style={getStoryTheme(story, "general")}>
                {story.sections.map((s) => {
                    const SectionComp = useSectionType(s.type)
                    return SectionComp ? (
                        <section id={s.id} className={`section-${s.type}`}>
                            <SectionComp
                                section={s}
                                resources={story.resources}
                            />
                        </section>
                    ) : null
                })}
            </main>
        </div>
    )
}
