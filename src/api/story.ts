import { useEffect, useState } from "preact/hooks"
import { MapConfig } from "./context/context-types"
import { CSSProperties, StoryThemes } from "./theme"

const baseUrl = `${import.meta.env.VITE_BACKEND}/rest/geostore`
const storyEndpoint = "data"

export type BaseStoryResource = {
    id: string
}

export type ImageStoryResource = BaseStoryResource & {
    type: "image"
    data: {
        imgHeight: number
        imgWidth: number
        src: string
        title: string
    }
}

export type VideoStoryResource = BaseStoryResource & {
    type: "video"
    data: {
        description: string
        src: string
        title: string
        thumbnail: string
    }
}

export type MapStoryResource = BaseStoryResource & {
    type: "map"
    data: {
        id: string
    } & MapConfig["map"]
}

export type StoryResource =
    | ImageStoryResource
    | VideoStoryResource
    | MapStoryResource

export type BaseStorySection = {
    id: string
    title: string
    contents: StoryContent[]
}

export type TitleStorySection = BaseStorySection & {
    type: "title"
}

export type StorySection = TitleStorySection

export type CustomContentTheme = {
    value: "custom"
    custom: CSSProperties
}

export type ContentTheme = CustomContentTheme

export type BaseStoryContent = {
    id: string
    size?: "small" | "medium" | "large"
    theme?: ContentTheme
}

export type ContentBackground = {
    fit: "cover"
    size: "full"
    align: "center"
    theme: "bright"
    resourceId: string
    type: "image"
}

export type TextStoryContent = BaseStoryContent & {
    type: "text"
    html?: string
    background?: ContentBackground
}

export type StoryContent = TextStoryContent

export type Story = {
    type: "cascade"
    resources: StoryResource[]
    sections: StorySection[]
    settings: {
        storyTitle: string
        storyTitleFontSize?: string
        isHomeButtonEnabled: boolean
        isLogoEnabled: boolean
        isNavbarEnabled: boolean
        isTitleEnabled: boolean
        theme?: {
            [key in StoryThemes]: CSSProperties
        }
        checked: string[]
    }
}

export function loadStory(storyId: string, local: boolean): Promise<Story> {
    const url = local ? storyId : `${baseUrl}/${storyEndpoint}/${storyId}`
    return fetch(url, {
        headers: {
            Accept: "application/json, text/plain, */*",
        },
    })
        .then((resp) => {
            if (resp.ok) return resp.json()
            return resp.text().then((t) => {
                throw new Error(`Error loading ${storyId}: ${t}`)
            })
        })
        .then((resource: Story) => {
            return resource
        })
}

export function useStory() {
    const url = new URL(window.location.href)
    const storyId = url.searchParams.get("story") ?? "story.json"
    const local = storyId === "story.json"

    const [story, setStory] = useState<Story | null>(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        loadStory(storyId, local)
            .then(setStory)
            .catch((e) => setError(e?.message || "Unknown error"))
    }, [])
    return { story, error }
}

export type SectionComponentProps = {
    section: StorySection
    resources: StoryResource[]
}

export type ContentComponentProps = {
    content: StoryContent
    resources: StoryResource[]
}

export type SectionComponent = (
    props: SectionComponentProps
) => JSX.Element | null

type SectionTypes = {
    [key: string]: SectionComponent
}

export type ContentComponent = (
    props: ContentComponentProps
) => JSX.Element | null

type ContentTypes = {
    [key: string]: ContentComponent
}

export function useSectionType(type: string) {
    const [components, setComponents] = useState<SectionTypes>({})
    useEffect(() => {
        if (!components[type]) {
            import(`../story-sections/${type.toLowerCase()}.tsx`)
                .then((impl) => {
                    setComponents((old) => ({
                        ...old,
                        [type]: impl.default,
                    }))
                })
                .catch(() => {
                    console.error(`section type ${type} not implemented`)
                })
        }
    }, [type])
    return components[type]
}

export function useContentType(type: string) {
    const [components, setComponents] = useState<ContentTypes>({})
    useEffect(() => {
        if (!components[type]) {
            import(`../story-content/${type.toLowerCase()}.tsx`)
                .then((impl) => {
                    setComponents((old) => ({
                        ...old,
                        [type]: impl.default,
                    }))
                })
                .catch(() => {
                    console.error(`component type ${type} not implemented`)
                })
        }
    }, [type])
    return components[type]
}
