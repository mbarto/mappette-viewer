import OLAttribution from "ol/control/Attribution"
import { useEffect, useRef } from "preact/hooks"
import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import "./attribution/attribution.css"

type AttributionPluginProps = PluginProps

export default function Attribution({}: AttributionPluginProps) {
    const map = useMap()
    const attribution = useRef<OLAttribution>()
    useEffect(() => {
        if (map?.current) {
            attribution.current = new OLAttribution({
                target: document.querySelector(
                    ".mapstore-attribution"
                ) as HTMLElement,
            })

            map.current.addControl(attribution.current)
        }
        return () => {
            if (attribution.current && map?.current)
                map.current?.removeControl(attribution.current)
        }
    }, [map?.current])
    return <div className="mapstore-attribution"></div>
}

export const container = "mapfooter"
