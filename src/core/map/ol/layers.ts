import Layer from "ol/layer/Layer"
import { MapLayer } from "../../../api/context"

const layerTypes: {
    [key: string]: LayerImpl
} = {}

export type LayerImpl = {
    create: (layer: MapLayer, projection: string) => Layer | null
}

export function addLayerType(type: string, impl: LayerImpl) {
    layerTypes[type] = impl
}

export function createLayers(layers: MapLayer[], projection: string): Layer[] {
    return layers
        .filter((l) => l.visibility)
        .reduce((acc: Layer[], layer) => {
            const olLayer = createLayer(layer, projection)
            if (olLayer) return [...acc, olLayer]
            return acc
        }, [])
}

export function createLayer(
    layer: MapLayer,
    mapProjection = "EPSG:3857"
): Layer | null {
    const impl = layerTypes[layer.type]
    if (impl) {
        return impl.create(layer, mapProjection)
    }
    console.error(`Layer type ${layer.type} not implemented`)
    return null
}
