import { useEffect } from "preact/hooks"
import Box, { CSSProperties, Rectangle } from "./box"
import MapViewer from "../plugins/map"
import ScaleBox from "../plugins/scalebox"
import { Context } from "../api/context"
import { MapInstance } from "../core/map"

export type Orientation = "portrait" | "landscape"
export type Sheet = "A4" | "A3"

export function usePage(orientation: Orientation, sheet: Sheet) {
    useEffect(() => {
        document.body.classList.remove("portrait")
        document.body.classList.remove("landscape")
        document.body.classList.add(orientation)

        document.body.classList.remove("A4")
        document.body.classList.remove("A3")
        document.body.classList.add(sheet)

        const style = document.getElementById("page-style")
        if (style) document.head.removeChild(style)

        const pageStyle = document.createElement("style")
        pageStyle.id = "page-style"
        pageStyle.setAttribute("type", "text/css")
        pageStyle.appendChild(
            document.createTextNode(
                `@page {margin: 0; size: ${sheet} ${orientation}}`
            )
        )
        document.head.appendChild(pageStyle)
    }, [orientation, sheet])
}

export type Page = {
    id: number
    components: PageComponent[]
}

export type PageComponent = {
    type: string
    id: string
    box: Rectangle
    stylable?: boolean
    style?: CSSProperties
    dragButton?: number
}

type PageProps = {
    isSelected: boolean
    onSelectComponent: (c: string | null) => void
    onSelectPage: () => void
    page: Page
    selectedComponent: string | null
    context: Context
    setMap: (map: MapInstance) => void
}

export default function PrintedPage({
    page,
    isSelected,
    selectedComponent,
    onSelectComponent,
    onSelectPage,
    context,
    setMap,
}: PageProps) {
    function renderComponent(component: PageComponent) {
        const pluginsProps = {
            setMap,
            context,
            mapType: "ol",
            plugins: [],
            allPlugins: [],
            cfg: {},
        }
        if (component.type === "map") return <MapViewer {...pluginsProps} />
        if (component.type === "text")
            return <div contentEditable>{context.windowTitle || "Title"}</div>
        if (component.type === "scale") return <ScaleBox {...pluginsProps} />
        return null
    }

    return (
        <div
            style={{}}
            className={`sheet ${isSelected ? "selected" : ""}`}
            onClick={(e) => {
                if (e.target instanceof HTMLDivElement) {
                    if (!e.target.closest(".box")) onSelectComponent(null)
                }
                onSelectPage()
            }}
        >
            {page.components.map((c) => (
                <Box
                    key={c.id}
                    id={c.id}
                    rect={c.box}
                    stylable={c.stylable}
                    boxStyle={c.style}
                    selected={c.id === selectedComponent}
                    onSelect={onSelectComponent}
                >
                    {renderComponent(c)}
                </Box>
            ))}
        </div>
    )
}
