import { useEffect, useRef, useState } from "preact/hooks"
import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"

type IdentifyPluginProps = PluginProps

export default function Identify({ mapType }: IdentifyPluginProps) {
    const map = useMap()
    const listener = useRef<number | undefined>()
    const [selected, setSelected] = useState(true)
    useEffect(() => {
        if (map) {
            if (selected) {
                listener.current = map.addListener("click", (evt) => {
                    if (selected) {
                        alert(JSON.stringify(evt))
                    }
                })
            } else {
                if (listener.current) {
                    map.removeListener(listener.current)
                }
            }
        }
    }, [selected, map])

    function toggleSelected() {
        setSelected((sel) => !sel)
    }
    return (
        <ToolbarButton
            id="identify"
            tooltip="info.tooltip"
            onClick={toggleSelected}
            selected={selected}
            icon="map-marker"
        />
    )
}

export const container = "toolbar"
