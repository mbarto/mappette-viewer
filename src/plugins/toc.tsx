import { useState } from "preact/hooks"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"
import "./toc/toc.css"
import { useMap } from "../core/map"
import { Context, MapLayer, MapLayerGroup } from "../api/context"
import { useLocale } from "../api/locale"
import { useCssVariable } from "../core/css"

type TableOfContentsProps = PluginProps

type Group = MapLayerGroup & {
    layers: MapLayer[]
}

export default function TableOfContents({ context }: TableOfContentsProps) {
    const [status, setStatus] = useState("")
    const [groupStatus, setGroupStatus] = useState<{
        [key: string]: boolean
    }>(
        getGroups(context).reduce(
            (all, g) => ({ ...all, [g.id]: g.expanded }),
            {}
        )
    )
    const map = useMap()
    const locale = useLocale()
    function toggle() {
        setStatus((s) => (s !== "open" ? "open" : "closed"))
    }
    function setVisibility(id: string, val: boolean) {
        if (map) {
            map.setLayerVisibility(id, val)
        }
    }
    function setOpacity(id: string, val: number) {
        if (map) {
            map.setLayerOpacity(id, val / 100.0)
        }
    }
    function toggleGroup(id: string) {
        setGroupStatus({
            ...groupStatus,
            [id]: !groupStatus[id],
        })
    }
    useCssVariable("--left-panel-open", () => (status === "open" ? "1" : "0"), [
        status,
    ])
    return (
        <>
            <ToolbarButton
                id="toc"
                icon="1-layer"
                tooltip="layers"
                onClick={toggle}
            />
            <div className={`mapstore-table-of-contents ${status}`}>
                <div className="toc-header">
                    <span
                        className="toc-close glyphicon glyphicon-1-close"
                        onClick={toggle}
                    ></span>
                    <span className="toc-icon glyphicon glyphicon-1-layer"></span>
                </div>
                <div className="toc-body">
                    <div className="toc-title">
                        <span className="glyphicon glyphicon-1-map"></span>{" "}
                        {context.windowTitle}
                    </div>
                    <div className="toc-layers-container">
                        {getGroups(context).map((g) => (
                            <div className="toc-group">
                                <div className="toc-group-header">
                                    <span className="toc-group-title">
                                        {g.title}
                                    </span>
                                    <span
                                        className={`glyphicon glyphicon-folder-${
                                            groupStatus[g.id] ? "open" : "close"
                                        }`}
                                        onClick={() => toggleGroup(g.id)}
                                    ></span>
                                </div>
                                <div
                                    className="toc-group-layers"
                                    style={{
                                        display: groupStatus[g.id]
                                            ? "block"
                                            : "none",
                                    }}
                                >
                                    {g.layers.map((l) => (
                                        <div className="toc-layer">
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    checked={l.visibility}
                                                    onChange={(evt) =>
                                                        setVisibility(
                                                            l.id,
                                                            (
                                                                evt.target as HTMLInputElement
                                                            ).checked
                                                        )
                                                    }
                                                />{" "}
                                                <span>
                                                    {getTitle(l, locale)}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={(l.opacity ?? 1) * 100}
                                                onChange={(evt) =>
                                                    setOpacity(
                                                        l.id,
                                                        Number(
                                                            (
                                                                evt.target as HTMLInputElement
                                                            ).value
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
function getTitle(layer: MapLayer, locale: string): string {
    if (typeof layer.title === "string") {
        return layer.title
    }
    if (layer.title) {
        return layer.title[locale] || layer.title["default"]
    }
    return layer.name
}

function getGroups(context: Context): Group[] {
    return context.mapConfig.map.groups.map((group) => ({
        ...group,
        layers: getLayers(context.mapConfig.map.layers, group.id),
    }))
}

function getLayers(layers: MapLayer[], group: string): MapLayer[] {
    return layers
        .filter((l) => l.group === group || (!l.group && group === "Default"))
        .reverse()
}
