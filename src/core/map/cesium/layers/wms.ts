import {
    SingleTileImageryProvider,
    WebMapServiceImageryProvider,
    ImageryProvider,
    Resource,
} from "cesium"
import { MapLayer } from "../../../../api/context"
import { addLayerType } from "../layers"

export type WMSLayer = MapLayer & {
    type: "wms"
    format?: string
    url: string
    singleTile?: boolean
    style?: string
    transparent?: boolean
    tiled?: boolean
    tileSize?: number
    size?: number
    tileDiscardPolicy?: string
}

export function createLayer(layer: MapLayer): ImageryProvider {
    const wmsLayer = layer as WMSLayer
    const opacity = layer.opacity !== undefined ? layer.opacity : 1
    if (wmsLayer.singleTile) {
        const parameters = {
            styles: wmsLayer.style || "",
            format: wmsLayer.format || "image/png",
            transparent:
                wmsLayer.transparent !== undefined
                    ? String(wmsLayer.transparent)
                    : "true",
            opacity: String(opacity),
            tiled:
                wmsLayer.tiled !== undefined ? String(wmsLayer.tiled) : "true",
            layers: layer.name,
            width: String(wmsLayer.size) || "2000",
            height: String(wmsLayer.size) || "2000",
            bbox: "-180.0,-90,180.0,90",
            srs: "EPSG:4326",
        }

        const url =
            (Array.isArray(wmsLayer.url)
                ? wmsLayer.url[
                      Math.round(Math.random() * (wmsLayer.url.length - 1))
                  ]
                : wmsLayer.url) +
            "?service=WMS&version=1.1.0&request=GetMap&" +
            new URLSearchParams(Object.entries(parameters)).toString()

        return new SingleTileImageryProvider({
            url: new Resource({
                url,
            }),
        })
    } else {
        return new WebMapServiceImageryProvider({
            url: Array.isArray(wmsLayer.url)
                ? wmsLayer.url[
                      Math.round(Math.random() * (wmsLayer.url.length - 1))
                  ]
                : wmsLayer.url,
            layers: wmsLayer.name,
            enablePickFeatures: false,
            parameters: {
                styles: wmsLayer.style || "",
                format: wmsLayer.format || "image/png",
                transparent:
                    wmsLayer.transparent !== undefined
                        ? wmsLayer.transparent
                        : true,
                opacity: opacity,
                tiled: wmsLayer.tiled !== undefined ? wmsLayer.tiled : true,
                width: wmsLayer.tileSize || 256,
                height: wmsLayer.tileSize || 256,
            },
        })
    }
}

addLayerType("wms", {
    create: createLayer,
})
