import { useState } from "preact/hooks"
import { MapLayer } from "../api/context"
import { useMessage } from "../api/locale"
import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import "./backgroundselector/backgroundselector.css"

type BackgroundSelectorPluginProps = PluginProps

const backgroundImages: { [key: string]: string } = {
    Night2012: "NASA_NIGHT",
    "s2cloudless:s2cloudless": "s2cloudless",
    empty: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAD1APUDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//EABQQAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQEAAQUCcH//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAEDAQE/AXB//8QAFBEBAAAAAAAAAAAAAAAAAAAAkP/aAAgBAgEBPwFwf//EABQQAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQEABj8CcH//xAAUEAEAAAAAAAAAAAAAAAAAAACQ/9oACAEBAAE/IXB//9oADAMBAAIAAwAAABCSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSf/8QAFBEBAAAAAAAAAAAAAAAAAAAAkP/aAAgBAwEBPxBwf//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQIBAT8QcH//xAAUEAEAAAAAAAAAAAAAAAAAAACQ/9oACAEBAAE/EHB//9k=",
}

const baseUrl = `${
    import.meta.env.VITE_BACKEND
}/dist/web/client/plugins/background/assets/img`

function getImage(layer: MapLayer): string {
    const img = backgroundImages[layer.name ?? "empty"] ?? layer.name
    return img.startsWith("data:image") ? img : `${baseUrl}/${img}.jpg`
}

type BackgroundPreviewProps = {
    background: MapLayer
    className: string
    tooltip?: string
    onClick?: () => void
    onOver?: () => void
    onOut?: () => void
}

function BackgroundPreview({
    background,
    className,
    tooltip,
    onClick,
    onOver,
    onOut,
}: BackgroundPreviewProps) {
    return (
        <div
            className={className}
            title={tooltip}
            onClick={onClick}
            onMouseEnter={onOver}
            onMouseLeave={onOut}
        >
            <label>{background.title}</label>
            <img src={getImage(background)} />
        </div>
    )
}

function renderBackgrounds(
    backgrounds: MapLayer[],
    current: MapLayer,
    onClick: (background: MapLayer) => void,
    onOver: (background: MapLayer) => void,
    onOut: (background: MapLayer) => void
) {
    return backgrounds.map((b) => (
        <BackgroundPreview
            className={`background-preview ${
                current.id === b.id ? "selected" : ""
            }`}
            background={b}
            onClick={() => onClick(b)}
            onOver={() => onOver(b)}
            onOut={() => onOut(b)}
        />
    ))
}

export default function BackgroundSelector({
    context,
}: BackgroundSelectorPluginProps) {
    const map = useMap()
    const backgrounds = context.mapConfig.map.layers.filter(
        (l) => l.group === "background"
    )
    const [current, setCurrent] = useState(
        backgrounds.filter((l) => l.visibility)?.[0]
    )
    const [temporary, setTemporary] = useState<MapLayer | null>(null)
    const [open, setOpen] = useState(false)
    function toggleOpen() {
        setOpen((v) => !v)
    }
    const tooltip = useMessage("backgroundSwitcher.tooltip")
    const main = temporary ?? current
    return (
        <div className="mapstore-background-selector">
            <div className="backgrounds-container">
                <BackgroundPreview
                    className={`background-preview current ${
                        open ? "open" : "closed"
                    }`}
                    background={main}
                    tooltip={tooltip}
                    onClick={toggleOpen}
                />
                {open
                    ? renderBackgrounds(
                          backgrounds,
                          current,
                          (b) => {
                              setCurrent(b)
                              setTemporary(null)
                              setOpen(false)
                              if (map) map.setBackground(b.id)
                          },
                          (b) => setTemporary(b),
                          () => setTemporary(null)
                      )
                    : null}
            </div>
        </div>
    )
}
