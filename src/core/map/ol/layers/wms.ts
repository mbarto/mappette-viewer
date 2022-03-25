import ImageLayer from "ol/layer/Image"
import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import ImageWMS from "ol/source/ImageWMS"
import TileWMS from "ol/source/TileWMS"
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
}

export function createLayer(layer: MapLayer): Layer {
    const wmsLayer = layer as WMSLayer
    if (wmsLayer.singleTile) {
        return new ImageLayer({
            visible: layer.visibility,
            source: new ImageWMS({
                url: Array.isArray(wmsLayer.url)
                    ? wmsLayer.url[0]
                    : wmsLayer.url,
                params: {
                    LAYERS: wmsLayer.name,
                    FORMAT: wmsLayer.format || "image/png",
                    STYLES: wmsLayer.style,
                },
                ratio: 1,
                serverType: "geoserver",
            }),
            opacity: layer.opacity ?? 1,
        })
    } else {
        return new TileLayer({
            visible: layer.visibility,
            source: new TileWMS({
                url: Array.isArray(wmsLayer.url)
                    ? wmsLayer.url[0]
                    : wmsLayer.url,
                params: {
                    LAYERS: wmsLayer.name,
                    TILED: true,
                    FORMAT: wmsLayer.format || "image/png",
                    STYLES: wmsLayer.style,
                },
                transition: 0,
            }),
            opacity: layer.opacity ?? 1,
        })
    }
}

addLayerType("wms", {
    create: createLayer,
})
