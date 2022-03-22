import { useState } from "preact/hooks"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"
import "./toc/toc.css"
import { useMap } from "../core/map"

type TableOfContentsProps = PluginProps

export default function TableOfContents({ context }: TableOfContentsProps) {
    const [status, setStatus] = useState("")
    const map = useMap()
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
                    <div className="mapstore-layers-container">
                        {context.mapConfig.map.layers
                            .filter((l) => l.group !== "background")
                            .map((l) => (
                                <div>
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
                                        <span>{l.title ?? l.name}</span>
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
            </div>
        </>
    )
}
