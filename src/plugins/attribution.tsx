import OLAttribution from "ol/control/Attribution"
import { useEffect, useRef } from "preact/hooks"
import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import "./attribution/attribution.css"

type AttributionPluginProps = PluginProps

export default function Attribution({ mapType }: AttributionPluginProps) {
    const map = useMap()
    const attribution = useRef<OLAttribution>()
    useEffect(() => {
        if (map && mapType === "ol") {
            attribution.current = new OLAttribution({
                target: document.querySelector(
                    ".mapstore-attribution"
                ) as HTMLElement,
            })

            map.addControl(attribution.current)
        }
        return () => {
            if (attribution.current && map)
                map.removeControl(attribution.current)
        }
    }, [map])
    return <div className="mapstore-attribution"></div>
}

export const container = "mapfooter"
