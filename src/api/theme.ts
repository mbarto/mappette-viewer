import { Story, StoryContent } from "./story"

export type StoryThemes = "general" | "link" | "overlay"

export type CSSProperties = string | { [key: string]: string | number }

export function getStoryTheme(story: Story, theme: StoryThemes): CSSProperties {
    return story.settings.theme?.[theme] ?? {}
}

export function getContentTheme(content: StoryContent): CSSProperties {
    return content.theme?.value === "custom" ? content.theme.custom : {}
}
