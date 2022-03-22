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
}

export function createLayer(layer: MapLayer): Layer {
    const wmsLayer = layer as WMSLayer
    if (wmsLayer.singleTile) {
        return new ImageLayer({
            source: new ImageWMS({
                url: wmsLayer.url,
                params: {
                    LAYERS: wmsLayer.name,
                    FORMAT: wmsLayer.format || "image/png",
                },
                ratio: 1,
                serverType: "geoserver",
            }),
        })
    } else {
        return new TileLayer({
            source: new TileWMS({
                url: wmsLayer.url,
                params: {
                    LAYERS: wmsLayer.name,
                    TILED: true,
                    FORMAT: wmsLayer.format || "image/png",
                },
                transition: 0,
            }),
        })
    }
}

addLayerType("wms", {
    create: createLayer,
})
