import {
    SectionComponentProps,
    StoryContent,
    TitleStorySection,
    useContentType,
} from "../api/story"

type TitleSectionProps = SectionComponentProps & {
    section: TitleStorySection
}

export default function TitleSection({
    section,
    resources,
}: TitleSectionProps) {
    function renderContent(content: StoryContent) {
        const ContentComp = useContentType(content.type)
        return ContentComp ? (
            <div
                id={content.id}
                className={`content-${content.type} ${content.size ?? "small"}`}
            >
                <ContentComp content={content} resources={resources} />
            </div>
        ) : null
    }
    return section.contents.map(renderContent)
}
