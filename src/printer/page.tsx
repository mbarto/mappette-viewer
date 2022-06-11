import { useEffect } from "preact/hooks"
import Box, { CSSProperties, Rectangle } from "./box"
import MapViewer from "../core/map/map"
import ScaleBox from "./widgets/scalebox"
import { Context } from "../api/context"
import { MapInstance } from "../core/map"

export type Orientation = "portrait" | "landscape"
export type Sheet = "A4" | "A3"

function createOrReplaceStyle(id: string, content: string) {
    const style = document.getElementById(id)
    if (style) document.head.removeChild(style)

    const newStyle = document.createElement("style")
    newStyle.id = id
    newStyle.setAttribute("type", "text/css")
    newStyle.appendChild(document.createTextNode(content))
    document.head.appendChild(newStyle)
}

export function usePage(orientation: Orientation, sheet: Sheet, zoom: number) {
    useEffect(() => {
        document.body.classList.remove("portrait")
        document.body.classList.remove("landscape")
        document.body.classList.add(orientation)

        document.body.classList.remove("A4")
        document.body.classList.remove("A3")
        document.body.classList.add(sheet)

        createOrReplaceStyle(
            "page-style",
            `@page {margin: 0; size: ${sheet} ${orientation}}`
        )
        createOrReplaceStyle(
            "zoom-style",
            `@media screen { .sheet { zoom: ${zoom}}}`
        )
    }, [orientation, sheet, zoom])
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
    lockable?: boolean
    locked?: boolean
}

type PageProps = {
    isSelected: boolean
    onSelectComponent: (c: string | null) => void
    onSelectPage: () => void
    page: Page
    selectedComponent: string | null
    context: Context
    setMap: (map: MapInstance) => void
    zoom: number
}

export default function PrintedPage({
    page,
    isSelected,
    selectedComponent,
    onSelectComponent,
    onSelectPage,
    context,
    setMap,
    zoom,
}: PageProps) {
    function renderComponent(component: PageComponent) {
        if (component.type === "map")
            return (
                <MapViewer
                    cfg={{
                        id: "map",
                        className: "printer-map",
                    }}
                    mapType="ol"
                    setMap={setMap}
                    mapConfig={context.mapConfig}
                />
            )
        if (component.type === "text")
            return <div contentEditable>{context.windowTitle || "Title"}</div>
        if (component.type === "scale") return <ScaleBox />
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
                    lockable={c.lockable}
                    initiallyLocked={c.locked}
                    zoom={zoom}
                >
                    {renderComponent(c)}
                </Box>
            ))}
        </div>
    )
}
