import { ContentBackground, StoryResource } from "../api/story"

type ContentBackgroundProps = ContentBackground & {
    resources: StoryResource[]
}

export default function Background({
    resourceId,
    resources,
}: ContentBackgroundProps) {
    const images = resources.filter((r) => r.id === resourceId)
    if (images.length === 1) {
        const image = images[0]
        if (image.type !== "image")
            return <span>Only images supported as background</span>
        return (
            <div className="section-background">
                <img src={image.data.src} />
            </div>
        )
    }
    return <span>{`Resource not found: ${resourceId}`}</span>
}
