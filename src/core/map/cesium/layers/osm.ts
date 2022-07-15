import ImageryProvider from "cesium/Source/Scene/ImageryProvider"
import OpenStreetMapImageryProvider from "cesium/Source/Scene/OpenStreetMapImageryProvider"
import { MapLayer } from "../../../../api/context-types"
import { addLayerType } from "../layers"

export type OSMLayer = MapLayer & {
    type: "osm"
}

export function createLayer(): ImageryProvider {
    return new OpenStreetMapImageryProvider({})
}

addLayerType("osm", {
    create: createLayer,
})
