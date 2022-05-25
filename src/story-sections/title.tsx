import { SectionComponentProps } from "../api/story"

type TextSectionProps = SectionComponentProps

export default function TextSection({ section }: TextSectionProps) {
    return <>{section.title}</>
}
