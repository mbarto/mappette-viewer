import "./map/map.css"

import { PluginProps } from "../core/plugins"
import MapComponent from "../core/map/map"

type MapPluginProps = PluginProps & {
    cfg: {
        id?: string
    }
}

export default function Map({ cfg, context, mapType, setMap }: MapPluginProps) {
    return (
        <MapComponent
            cfg={cfg}
            mapType={mapType}
            setMap={setMap}
            mapConfig={context.mapConfig}
        />
    )
}
