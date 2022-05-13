import { Page } from "./page"
import "./thumbnails/thumbnails.css"

type ThumbnailsProps = {
    pages: Page[]
    selectedPage: number
    onSelect: (page: number) => void
}

export default function Thumbnails({
    pages,
    selectedPage,
    onSelect,
}: ThumbnailsProps) {
    return (
        <div className="thumbnails">
            {pages.map((p, idx) => (
                <div
                    onClick={() => onSelect(idx)}
                    className={`thumbnails-page ${
                        idx === selectedPage ? "selected" : ""
                    }`}
                >
                    {idx + 1}
                </div>
            ))}
        </div>
    )
}
