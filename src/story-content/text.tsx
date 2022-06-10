import { ContentComponentProps, TextStoryContent } from "../api/story"
import { getContentTheme } from "../api/theme"
import Background from "./background"

type TextSectionProps = ContentComponentProps & {
    content: TextStoryContent
}

export default function TextComponent({
    content,
    resources,
}: TextSectionProps) {
    return (
        <>
            {content.background ? (
                <Background {...content.background} resources={resources} />
            ) : null}
            <div
                className="content-text-container"
                style={getContentTheme(content)}
                dangerouslySetInnerHTML={{ __html: content.html ?? "" }}
            ></div>
        </>
    )
}
