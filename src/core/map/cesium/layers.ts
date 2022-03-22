import { MapLayer } from "../../../api/context"
import { ImageryProvider } from "cesium"

export type ImageryProviderWithId = ImageryProvider & {
    mapstoreId: string
}

const layerTypes: {
    [key: string]: LayerImpl
} = {}

export type LayerImpl = {
    create: (layer: MapLayer) => ImageryProvider | null
}

export function addLayerType(type: string, impl: LayerImpl) {
    layerTypes[type] = impl
}

export function createLayers(layers: MapLayer[]): ImageryProvider[] {
    return layers
        .filter((l) => l.visibility)
        .reduce((acc: ImageryProvider[], layer) => {
            const cesiumLayer = createLayer(layer)
            if (cesiumLayer) return [...acc, cesiumLayer]
            return acc
        }, [])
}

export function createLayer(layer: MapLayer): ImageryProvider | null {
    const impl = layerTypes[layer.type]
    if (impl) {
        const provider = impl.create(layer) as ImageryProviderWithId
        provider.mapstoreId = layer.id
        return provider
    }
    console.error(`Layer type ${layer.type} not implemented`)
    return null
}
