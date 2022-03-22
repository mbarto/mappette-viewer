import { useEffect } from "preact/hooks"
import "./map/map.css"

import { PluginProps } from "../core/plugins"
import { loadProvider } from "../core/map"

type MapPluginProps = PluginProps & {
    cfg: {
        id?: string
    }
}

export default function Map({ cfg, context, mapType, setMap }: MapPluginProps) {
    const { id = "map" } = cfg
    useEffect(() => {
        loadProvider(mapType).then((provider) => {
            const mapConfig = context.mapConfig.map
            setMap(provider.create(id, mapConfig))
        })
    }, [context])
    return <div id={id} className="mapstore-map"></div>
}
