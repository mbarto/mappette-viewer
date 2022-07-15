import Layer from "ol/layer/Layer"
import { MapLayer, MapSources } from "../../../api/context/context-types"

const layerTypes: {
    [key: string]: LayerImpl
} = {}

export type LayerImpl = {
    create: (
        layer: MapLayer,
        projection: string,
        sources: MapSources
    ) => Layer | null
}

export function addLayerType(type: string, impl: LayerImpl) {
    layerTypes[type] = impl
}

export function createLayers(
    layers: MapLayer[],
    projection: string,
    sources?: MapSources
): Layer[] {
    return layers.reduce((acc: Layer[], layer) => {
        const olLayer = createLayer(layer, projection, sources)
        if (olLayer) {
            olLayer.set("map_id", layer.id)
            olLayer.set("map_group_id", layer.group)
            return [...acc, olLayer]
        }
        return acc
    }, [])
}

export function createLayer(
    layer: MapLayer,
    mapProjection = "EPSG:3857",
    sources = {}
): Layer | null {
    const impl = layerTypes[layer.type]
    if (impl) {
        return impl.create(layer, mapProjection, sources)
    }
    console.error(`Layer type ${layer.type} not implemented`)
    return null
}
