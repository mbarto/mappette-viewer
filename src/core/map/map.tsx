import { useEffect, useRef } from "preact/hooks"
import { MapConfig } from "../../api/context/context-types"
import { loadProvider, MapInstance, useMap } from "../map"

type MapProps = {
    cfg: {
        id?: string
        className?: string
    }
    mapType: string
    setMap: (map: MapInstance) => void
    mapConfig: MapConfig
}

export default function Map({ cfg, mapType, setMap, mapConfig }: MapProps) {
    const { id = "map", className = "mappette-map" } = cfg
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
            setMap(provider.create(id, mapConfig.map))
        })
    }, [mapConfig])
    return <div id={id} className={className} ref={container}></div>
}
