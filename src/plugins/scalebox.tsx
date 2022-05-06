import { useEffect, useRef, useState } from "preact/hooks"
import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import { getProjectionScale } from "../core/projection"

type ScaleBoxPluginProps = PluginProps

function format(scale: number): string {
    return scale.toFixed(0)
}

export default function ScaleBox({}: ScaleBoxPluginProps) {
    const map = useMap()

    function getScale(): number {
        return (
            getProjectionScale(
                map?.getProjection() ?? "EPSG:3857",
                map?.getResolution() ?? 0
            ) ?? 0
        )
    }
    const [scale, setScale] = useState<number>(getScale())
    const listener = useRef<number | undefined>()
    useEffect(() => {
        if (map) {
            listener.current = map.addListener("zoom", (p) => {
                setScale(getScale())
            })
        }
    }, [map])
    return <div className="mapstore-scalebox">1:{format(scale)}</div>
}
