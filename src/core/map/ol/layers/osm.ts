import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { MapLayer } from "../../../../api/context/context-types"
import { addLayerType } from "../layers"

export type OSMLayer = MapLayer & {
    type: "osm"
}

export function createLayer(layer: MapLayer): Layer {
    return new TileLayer({
        visible: layer.visibility,
        source: new OSM(),
    })
}

addLayerType("osm", {
    create: createLayer,
})
