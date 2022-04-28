import { MapLayer } from "../../../api/context"
import { MapInstance, OnClickEvent } from "../../map"
import { Point } from "../../projection"
import { WMSLayer } from "./types"

export default function identify(
    map: MapInstance,
    layer: MapLayer,
    evt: OnClickEvent
): Promise<unknown> {
    const wmsLayer = layer as WMSLayer
    const url = new URL(wmsLayer.url)
    const pixelSize = 101
    const { minX, minY, maxX, maxY } = getBoundingBox(
        evt.coordinate,
        map.getResolution(),
        pixelSize
    )
    url.searchParams.append("SERVICE", "WMS")
    url.searchParams.append("VERSION", "1.1.1")
    url.searchParams.append("REQUEST", "GETFEATUREINFO")
    url.searchParams.append("LAYERS", wmsLayer.name)
    url.searchParams.append("QUERY_LAYERS", wmsLayer.name)
    url.searchParams.append("STYLES", wmsLayer.style ?? "")
    url.searchParams.append("SRS", map.getProjection() ?? "EPSG:3857")
    url.searchParams.append("WIDTH", `${pixelSize}`)
    url.searchParams.append("HEIGHT", `${pixelSize}`)
    url.searchParams.append("X", "51")
    url.searchParams.append("Y", "51")
    url.searchParams.append("FEATURE_COUNT", "10")
    url.searchParams.append("INFO_FORMAT", "application/json")
    url.searchParams.append("BBOX", `${minX},${minY},${maxX},${maxY}`)

    return fetch(`${url.toString()}`).then((r) =>
        r.json().catch((e) => ({
            error: e,
        }))
    )
}
function getBoundingBox(
    coordinate: Point,
    resolution = 0,
    pixelSize: number
): { minX: number; minY: number; maxX: number; maxY: number } {
    const size = pixelSize * resolution
    return {
        minX: coordinate.x - size,
        maxX: coordinate.x + size,
        minY: coordinate.y - size,
        maxY: coordinate.y + size,
    }
}
