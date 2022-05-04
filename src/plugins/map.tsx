import { useEffect, useRef } from "preact/hooks"
import "./map/map.css"

import { PluginProps } from "../core/plugins"
import { loadProvider, useMap } from "../core/map"

type MapPluginProps = PluginProps & {
    cfg: {
        id?: string
    }
}

export default function Map({ cfg, context, mapType, setMap }: MapPluginProps) {
    const { id = "map" } = cfg
    const map = useMap()
    const container = useRef<HTMLDivElement | null>(null)
    function onResize() {
        if (map) map.resize()
    }
    useEffect(() => {
        if (container.current) {
            const observer = new ResizeObserver(onResize)
            observer.observe(container.current)
            return () => observer.disconnect()
        }
    }, [container.current])
    useEffect(() => {
        loadProvider(mapType).then((provider) => {
            const mapConfig = context.mapConfig.map
            setMap(provider.create(id, mapConfig))
        })
    }, [context])
    return <div id={id} className="mapstore-map" ref={container}></div>
}
