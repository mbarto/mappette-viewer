import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import WMTS from "ol/source/WMTS"
import WMTSTileGrid from "ol/tilegrid/WMTS"
import { getTopLeft, getWidth } from "ol/extent"
import { get as getProjection } from "ol/proj"
import { MapLayer } from "../../api/context"
import { addLayerType } from "../layers"

export type WMTSLayer = MapLayer & {
    type: "wmts"
    format?: string
    url: string
    singleTile?: boolean
    style?: string
}

export function createLayer(
    layer: MapLayer,
    mapProjection: string
): Layer | null {
    const wmtsLayer = layer as WMTSLayer
    const projection = getProjection(mapProjection)
    if (projection) {
        const projectionExtent = projection.getExtent()
        const size = getWidth(projectionExtent) / 256
        const resolutions = new Array(19)
        const matrixIds = new Array(19)
        for (let z = 0; z < 19; ++z) {
            // generate resolutions and matrixIds arrays for this WMTS
            resolutions[z] = size / Math.pow(2, z)
            matrixIds[z] = `EPSG:900913:${z}`
        }

        return new TileLayer({
            source: new WMTS({
                url: wmtsLayer.url,
                layer: wmtsLayer.name,
                matrixSet: "EPSG:900913",
                format: wmtsLayer.format || "image/png",
                projection: mapProjection,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds,
                }),
                style: wmtsLayer.style || "default",
                wrapX: true,
            }),
        })
    }
    return null
}

addLayerType("wmts", {
    create: createLayer,
})
