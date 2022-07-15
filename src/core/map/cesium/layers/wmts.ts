import { MapLayer, MapSources } from "../../../../api/context-types"
import { addLayerType } from "../layers"
import { matchesProjection } from "../../../projection"
import ImageryProvider from "cesium/Source/Scene/ImageryProvider"
import WebMapTileServiceImageryProvider from "cesium/Source/Scene/WebMapTileServiceImageryProvider"
import Resource from "cesium/Source/Core/Resource"
import GeographicTilingScheme from "cesium/Source/Core/GeographicTilingScheme"

export type WMTSLayer = MapLayer & {
    type: "wmts"
    format?: string
    url: string
    singleTile?: boolean
    style?: string
    tileWidth?: number
    tileHeight?: number
    tileSize?: number
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

export type Coordinate = number[]

export function createLayer(
    layer: MapLayer,
    sources: MapSources
): ImageryProvider | null {
    const wmtsLayer = layer as WMTSLayer
    const source = sources[wmtsLayer.url]
    const tileMatrix = getTileMatrix(source as WMTSLayerSource)

    if (tileMatrix) {
        const [resolutions, matrixSet, matrixIds, origin] = tileMatrix
        const url = Array.isArray(wmtsLayer.url)
            ? wmtsLayer.url[
                  Math.round(Math.random() * (wmtsLayer.url.length - 1))
              ]
            : wmtsLayer.url
        return new WebMapTileServiceImageryProvider({
            url: new Resource({
                url,
            }),
            format: wmtsLayer.format || "image/png",
            tilingScheme: new GeographicTilingScheme(),
            layer: wmtsLayer.name,
            style: wmtsLayer.style || "",
            tileMatrixLabels: matrixIds,
            tileWidth: wmtsLayer.tileWidth || wmtsLayer.tileSize || 256,
            tileHeight: wmtsLayer.tileHeight || wmtsLayer.tileSize || 256,
            tileMatrixSetID: matrixSet,
            maximumLevel: 30,
        })
    }
    return null
}

addLayerType("wmts", {
    create: createLayer,
})
function getTileMatrix(
    source?: WMTSLayerSource
): [number[], string, string[], Coordinate] | null {
    if (source) {
        const matrix = getMatrixFor(source)
        if (matrix) {
            const matrixIds = matrix.TileMatrix.map((t) => t["ows:Identifier"])
            const origin = matrix.TileMatrix[0].TopLeftCorner.split(" ").map(
                (x) => Number(x)
            )
            const metersPerUnit = 1000
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
    } else {
        const size = 360 / 256
        const resolutions = new Array(19)
        const matrixIds = new Array(19)
        for (let z = 0; z < 19; ++z) {
            resolutions[z] = size / Math.pow(2, z)
            matrixIds[z] = `EPSG:4326:${z}`
        }
        return [resolutions, "EPSG:4326", matrixIds, [-180, 90]]
    }
    return null
}

function getMatrixFor(source: WMTSLayerSource) {
    const match = Object.keys(source.tileMatrixSet).find((key) =>
        matchesProjection(
            source.tileMatrixSet[key]["ows:SupportedCRS"],
            "EPSG:4326"
        )
    )
    if (match) {
        return source.tileMatrixSet[match]
    }
}
