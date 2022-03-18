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
        if (map?.current) {
            scalebar.current = new ScaleLine({
                target: document.querySelector(
                    ".mapstore-scalebar"
                ) as HTMLElement,
            })

            map.current.addControl(scalebar.current)
        }
        return () => {
            if (scalebar.current && map?.current)
                map.current?.removeControl(scalebar.current)
        }
    }, [map?.current])
    return <div className="mapstore-scalebar"></div>
}

export const container = "mapfooter"
