import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import WMTS from "ol/source/WMTS"
import WMTSTileGrid from "ol/tilegrid/WMTS"
import { getTopLeft, getWidth } from "ol/extent"
import { get as getProjection } from "ol/proj"
import { MapLayer, MapSources } from "../../../../api/context/context-types"
import { addLayerType } from "../layers"
import { matchesProjection } from "../../../projection"
import { Coordinate } from "ol/coordinate"

export type WMTSLayer = MapLayer & {
    type: "wmts"
    format?: string
    url: string
    singleTile?: boolean
    style?: string
}

export type WMTSTileLevel = {
    "ows:Identifier": string
    ScaleDenominator: string
    TopLeftCorner: string
    TileWidth: string
    TileHeight: string
    MatrixWidth: string
    TMatrixHeight: string
}

export type WMTSLayerSource = {
    tileMatrixSet: {
        [key: string]: {
            "ows:Identifier": string
            "ows:SupportedCRS": string
            TileMatrix: WMTSTileLevel[]
        }
    }
}

export function createLayer(
    layer: MapLayer,
    mapProjection: string,
    sources: MapSources
): Layer | null {
    const wmtsLayer = layer as WMTSLayer

    const source = sources[wmtsLayer.url]
    const tileMatrix = getTileMatrix(mapProjection, source as WMTSLayerSource)

    if (tileMatrix) {
        const [resolutions, matrixSet, matrixIds, origin] = tileMatrix
        return new TileLayer({
            visible: layer.visibility,
            source: new WMTS({
                url: wmtsLayer.url,
                layer: wmtsLayer.name,
                matrixSet,
                format: wmtsLayer.format || "image/png",
                projection: mapProjection,
                tileGrid: new WMTSTileGrid({
                    origin,
                    resolutions,
                    matrixIds,
                }),
                style: wmtsLayer.style || "default",
                wrapX: true,
            }),
            opacity: layer.opacity ?? 1,
        })
    }
    return null
}

addLayerType("wmts", {
    create: createLayer,
})
function getTileMatrix(
    mapProjection?: string,
    source?: WMTSLayerSource
): [number[], string, string[], Coordinate] | null {
    if (mapProjection) {
        const projection = getProjection(mapProjection)
        if (source && projection) {
            const matrix = getMatrixFor(mapProjection, source)
            if (matrix) {
                const matrixIds = matrix.TileMatrix.map(
                    (t) => t["ows:Identifier"]
                )
                const origin = matrix.TileMatrix[0].TopLeftCorner.split(
                    " "
                ).map((x) => Number(x))
                const metersPerUnit = projection.getMetersPerUnit() ?? 1
                const scaleToResolution = (s: number) =>
                    (s * 0.28e-3) / metersPerUnit
                const scales = matrix.TileMatrix.map((t) =>
                    Number(t.ScaleDenominator)
                )
                return [
                    scales.map(scaleToResolution),
                    matrix["ows:Identifier"],
                    matrixIds,
                    origin,
                ]
            }
        } else if (projection) {
            const projectionExtent = projection.getExtent()
            const size = getWidth(projectionExtent) / 256
            const resolutions = new Array(19)
            const matrixIds = new Array(19)
            for (let z = 0; z < 19; ++z) {
                resolutions[z] = size / Math.pow(2, z)
                matrixIds[z] = `${mapProjection}:${z}`
            }
            return [
                resolutions,
                mapProjection,
                matrixIds,
                getTopLeft(projectionExtent),
            ]
        }
    }
    return null
}

function getMatrixFor(mapProjection: string, source: WMTSLayerSource) {
    const match = Object.keys(source.tileMatrixSet).find((key) =>
        matchesProjection(
            source.tileMatrixSet[key]["ows:SupportedCRS"],
            mapProjection
        )
    )
    if (match) {
        return source.tileMatrixSet[match]
    }
}
