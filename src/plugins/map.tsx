import { useEffect } from "preact/hooks"
import View from "ol/View"
import "ol/ol.css"
import "./map/map.css"
import { reproject } from "../core/projection"
import { createLayers } from "../core/layers"
import "../core/layers/all"
import { PluginProps } from "../core/plugins"
import OLMap from "ol/Map"
import { useMap } from "../core/map"

type MapPluginProps = PluginProps & {
    cfg: {
        id?: string
    }
}

export default function Map({ cfg, context }: MapPluginProps) {
    const { id = "map" } = cfg
    const map = useMap()
    useEffect(() => {
        if (map) {
            const mapConfig = context.mapConfig.map
            const projection = mapConfig.projection ?? "EPSG:3857"
            const center = reproject(mapConfig.center, projection)
            map.current = new OLMap({
                target: id,
                controls: [],
                view: new View({
                    center: [center.x, center.y],
                    projection,
                    zoom: mapConfig.zoom,
                }),
                layers: createLayers(mapConfig.layers, projection),
            })
        }
    }, [context, map])
    return <div id={id} className="mapstore-map"></div>
}
