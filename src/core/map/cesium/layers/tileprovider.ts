import Credit from "cesium/Source/Core/Credit"
import ImageryProvider from "cesium/Source/Scene/ImageryProvider"
import UrlTemplateImageryProvider from "cesium/Source/Scene/UrlTemplateImageryProvider"
import { MapLayer } from "../../../../api/context"
import {
    Config,
    getConfig,
    replaceAttribution,
} from "../../../layers/tileproviders/providers"
import { addLayerType } from "../layers"

export type TileProviderLayer = MapLayer &
    Config & {
        type: "tileprovider"
        provider: string
        minResolution?: number
        maxResolution?: number
    }

function template(str: string, data: { [key: string]: unknown } = {}) {
    return str.replace(
        /(?!(\{?[zyxs]?\}))\{*([\w_]+)*\}/g,
        function (st: string, arg1: string, arg2: string | undefined): string {
            let key = arg2 ?? arg1
            let value = data[key]

            if (value === undefined) {
                throw new Error("No value provided for variable " + st)
            } else if (typeof value === "function") {
                value = value(data)
            }
            return value as string
        }
    )
}

export function createLayer(layer: MapLayer): ImageryProvider | null {
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

        const cr = config.options.credits
        const credit = cr ? new Credit(cr.text) : config.options.attribution
        return new UrlTemplateImageryProvider({
            url: template(config.url, config.options),
            enablePickFeatures: false,
            subdomains: config.options.subdomains,
            maximumLevel: config.options.maxZoom,
            minimumLevel: config.options.minZoom,
            credit,
        })
    }

    console.error(`TileProvider ${provider} not supported`)
    return null
}

addLayerType("tileprovider", {
    create: createLayer,
})
