import { useEffect, useRef } from "preact/hooks"
import type { Context } from "../api/context"
import Map from "ol/Map"
import View from "ol/View"
import "ol/ol.css"
import { reproject } from "../core/projection"
import { createLayers } from "../core/layers"
import "../core/layers/all"

type ContextViewerProps = {
    id?: string
    context: Context
}

export default function ContextViewer({
    id = "map",
    context,
}: ContextViewerProps) {
    const map = useRef<Map | null>(null)
    useEffect(() => {
        if (context.windowTitle) {
            document.title = context.windowTitle
        }
        const mapConfig = context.mapConfig.map
        const projection = mapConfig.projection ?? "EPSG:3857"
        const center = reproject(mapConfig.center, projection)
        map.current = new Map({
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
