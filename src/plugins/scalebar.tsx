import ScaleLine from "ol/control/ScaleLine"
import { useEffect, useRef } from "preact/hooks"
import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import "./scalebar/scalebar.css"

type ScalebarPluginProps = PluginProps

export default function Scalebar({}: ScalebarPluginProps) {
    const map = useMap()
    const scalebar = useRef<ScaleLine>()
    useEffect(() => {
        if (map) {
            scalebar.current = new ScaleLine({
                target: document.querySelector(
                    ".mapstore-scalebar"
                ) as HTMLElement,
            })

            map.addControl(scalebar.current)
        }
        return () => {
            if (scalebar.current && map) map.removeControl(scalebar.current)
        }
    }, [map])
    return <div className="mapstore-scalebar"></div>
}

export const container = "mapfooter"
