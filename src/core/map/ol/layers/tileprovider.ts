import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import { MapLayer } from "../../../../api/context"
import { addLayerType } from "../layers"
import XYZ from "ol/source/XYZ"
import providers, { TileProviderOptions } from "./providers"

type Config = {
    url?: string
    options?: TileProviderOptions
}

export type TileProviderLayer = MapLayer &
    Config & {
        type: "tileprovider"
        provider: string
        minResolution?: number
        maxResolution?: number
    }

function getConfig(providerPath: string): Config | undefined {
    const [provider, variant, ...rest] = providerPath.split(".")
    const providerConfig = providers[provider]
    if (providerConfig) {
        if (variant) {
            const variantConfig = providerConfig.variants?.[variant]
            const url =
                typeof variantConfig !== "string"
                    ? variantConfig?.url ?? providerConfig.url
                    : providerConfig.url
            return {
                url:
                    typeof url === "function"
                        ? url(rest.splice(1, rest.length + 1).join("."))
                        : url,
                options: {
                    ...providerConfig.options,
                    ...(typeof variantConfig !== "string"
                        ? variantConfig?.options
                        : {}),
                },
            }
        }
        return {
            url:
                typeof providerConfig.url === "function"
                    ? providerConfig.url(
                          rest.splice(1, rest.length + 1).join(".")
                      )
                    : providerConfig.url,
            options: providerConfig.options ?? {},
        }
    }
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

function replaceAttribution(config?: Config) {
    if (config?.options?.attribution) {
        return {
            ...config,
            options: {
                ...config.options,
                attribution: replaceAttributionValue(
                    config.options.attribution
                ),
            },
        }
    }
    return config
}

function replaceAttributionValue(attribution: string): string {
    if (attribution.indexOf("{attribution.") !== -1) {
        return attribution.replace(
            /\{attribution.(\w*)\}/,
            (_, attributionName) => {
                const provider = providers[attributionName]
                return replaceAttributionValue(
                    provider?.options?.attribution ?? ""
                )
            }
        )
    }
    return attribution
}

export function template(str = "", data: { [key: string]: unknown } = {}) {
    return str.replace(
        /(\{(.*?)\})/g,
        function (st: string, arg1: string, arg2: string | undefined): string {
            let key = arg2 ?? arg1
            if (["x", "y", "z"].includes(key)) {
                return st
            }
            let value = data[key]

            if (value === undefined) {
                throw new Error("No value provided for variable " + st)
            } else if (typeof value === "function") {
                return value(data)
            }
            return value as string
        }
    )
}

function getUrls(opt: Config) {
    let url = opt.url || ""
    const subdomains =
        typeof opt.options?.subdomains === "string"
            ? String(opt.options?.subdomains).split("")
            : ["a", "b", "c"]

    return subdomains.map((c) =>
        template(url.replace("{s}", c), {
            ...opt.options,
        })
    )
}
