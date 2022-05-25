import { Story, useSectionType } from "../api/story"
import "./story-viewer/story.css"

type StoryViewerProps = {
    story: Story
}

export default function StoryViewer({ story }: StoryViewerProps) {
    return (
        <div id="page-story" className="page page-geostory">
            <div id="geostory-navigation"></div>
            <main>
                {story.sections.map((s) => {
                    const SectionComp = useSectionType(s.type)
                    return SectionComp ? (
                        <section id={s.id} className={`section-${s.type}`}>
                            <SectionComp section={s} />
                        </section>
                    ) : null
                })}
            </main>
        </div>
    )
}
