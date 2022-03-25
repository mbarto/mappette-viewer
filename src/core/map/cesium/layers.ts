import ImageryProvider from "cesium/Source/Scene/ImageryProvider"
import { MapLayer, MapSources } from "../../../api/context"

export type ImageryProviderWithId = ImageryProvider & {
    mapstoreId: string
    mapstoreGroupId: string
}

const layerTypes: {
    [key: string]: LayerImpl
} = {}

export type LayerImpl = {
    create: (layer: MapLayer, sources: MapSources) => ImageryProvider | null
}

export function addLayerType(type: string, impl: LayerImpl) {
    layerTypes[type] = impl
}

export function createLayers(
    layers: MapLayer[],
    sources?: MapSources
): ImageryProvider[] {
    return layers.reduce((acc: ImageryProvider[], layer) => {
        const cesiumLayer = createLayer(layer, sources)
        if (cesiumLayer) return [...acc, cesiumLayer]
        return acc
    }, [])
}

export function createLayer(
    layer: MapLayer,
    sources = {}
): ImageryProvider | null {
    const impl = layerTypes[layer.type]
    if (impl) {
        const provider = impl.create(layer, sources) as ImageryProviderWithId
        provider.mapstoreId = layer.id
        provider.mapstoreGroupId = layer.group ?? "Default"
        return provider
    }
    console.error(`Layer type ${layer.type} not implemented`)
    return null
}
