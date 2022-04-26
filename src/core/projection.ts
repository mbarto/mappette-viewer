import proj4 from "proj4"

export type Point = {
    x: number
    y: number
    z?: number
    crs: string
}

export function reproject(p: Point, to: string): Point {
    if (p.crs === to) return p
    return {
        ...proj4(p.crs, to).forward(p),
        crs: to,
    }
}

export function matchesProjection(
    projection: string,
    mapProjection: string
): boolean {
    return (
        normalizeProjection(projection) === normalizeProjection(mapProjection)
    )
}
export function normalizeProjection(projection: string) {
    let epsg = projection.startsWith("urn:ogc:def:crs:")
        ? projection.substring("urn:ogc:def:crs:".length).replace("::", ":")
        : projection
    return epsg === "EPSG:900913" ? "EPSG:3857" : epsg
}
