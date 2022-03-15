import { useEffect, useRef } from "preact/hooks"
import OLMap from "ol/Map"
import View from "ol/View"
import "ol/ol.css"
import { reproject } from "../core/projection"
import { createLayers } from "../core/layers"
import "../core/layers/all"
import { PluginProps } from "../core/plugins"

type MapPluginProps = PluginProps & {
    cfg: {
        id?: string
    }
}

export default function Map({ cfg, context }: MapPluginProps) {
    const { id = "map" } = cfg
    const map = useRef<OLMap | null>(null)
    useEffect(() => {
        const mapConfig = context.mapConfig.map
        const projection = mapConfig.projection ?? "EPSG:3857"
        const center = reproject(mapConfig.center, projection)
        map.current = new OLMap({
            target: id,
            view: new View({
                center: [center.x, center.y],
                projection,
                zoom: mapConfig.zoom,
            }),
            layers: createLayers(mapConfig.layers, projection),
        })
    }, [context])
    return <div id={id}></div>
}
