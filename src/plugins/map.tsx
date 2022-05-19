import { useEffect, useRef } from "preact/hooks"
import "./map/map.css"

import { PluginProps } from "../core/plugins"
import { loadProvider, useMap } from "../core/map"

type MapPluginProps = PluginProps & {
    cfg: {
        id?: string
    }
}

export default function Map({
    cfg,
    context,
    mapType,
    setMap,
    locked = false,
}: MapPluginProps) {
    const { id = "map" } = cfg
    const map = useMap()
    const container = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (container.current && map) {
            const observer = new ResizeObserver(() => map?.resize())
            observer.observe(container.current)
            return () => observer.disconnect()
        }
    }, [container.current, map])
    useEffect(() => {
        loadProvider(mapType).then((provider) => {
            const mapConfig = context.mapConfig.map
            setMap(provider.create(id, mapConfig, locked))
        })
    }, [context])
    useEffect(() => {
        if (map) {
            map.setLocked(locked)
        }
    }, [locked, map])
    return <div id={id} className="mapstore-map" ref={container}></div>
}
