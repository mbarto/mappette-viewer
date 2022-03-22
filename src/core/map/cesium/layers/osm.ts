import { OpenStreetMapImageryProvider, ImageryProvider } from "cesium"
import { MapLayer } from "../../../../api/context"
import { addLayerType } from "../layers"

export type OSMLayer = MapLayer & {
    type: "osm"
}

export function createLayer(layer: MapLayer): ImageryProvider {
    return new OpenStreetMapImageryProvider({})
}

addLayerType("osm", {
    create: createLayer,
})
