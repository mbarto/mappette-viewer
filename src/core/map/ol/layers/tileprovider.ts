import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import { MapLayer } from "../../../../api/context/context-types"
import { addLayerType } from "../layers"
import XYZ from "ol/source/XYZ"
import {
    Config,
    getConfig,
    replaceAttribution,
    getUrls,
    template,
} from "../../../layers/tileproviders/providers"

export type TileProviderLayer = MapLayer &
    Config & {
        type: "tileprovider"
        provider: string
        minResolution?: number
        maxResolution?: number
    }

export function createLayer(layer: MapLayer): Layer | null {
    const tileLayer = layer as TileProviderLayer
    const provider = tileLayer.provider
    const baseConfig =
        replaceAttribution(
            provider === "custom"
                ? {
                      url: tileLayer.url,
                      options: tileLayer.options,
                  }
                : getConfig(provider)
        ) || {}
    if (baseConfig && baseConfig.url) {
        const config = {
            url: baseConfig.url,
            options: {
                ...baseConfig.options,
                ...tileLayer,
            },
        }
        return new TileLayer({
            opacity: layer.opacity !== undefined ? layer.opacity : 1,
            visible: layer.visibility !== false,
            minResolution: tileLayer.minResolution,
            maxResolution: tileLayer.maxResolution,
            source: new XYZ({
                urls: config.url.match(/(\{s\})/)
                    ? getUrls(config)
                    : [template(config.url, config.options)],
                attributions: config.options.attribution
                    ? [config.options.attribution]
                    : [],
                maxZoom: config.options.maxZoom ?? 18,
                minZoom: config.options.minZoom ?? 0,
            }),
        })
    }

    console.error(`TileProvider ${provider} not supported`)
    return null
}

addLayerType("tileprovider", {
    create: createLayer,
})
