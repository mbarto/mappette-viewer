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

export type UOM = "m" | "degrees" | "ft" | "us-ft"

export const METERS_PER_UNIT: {
    [key in UOM]: number
} = {
    m: 1,
    degrees: 111194.87428468118,
    ft: 0.3048,
    "us-ft": 1200 / 3937,
}

export function isUOM(uom: string): uom is UOM {
    return uom === "m" || uom === "degrees" || uom === "ft" || uom === "us-ft"
}

export function getUnits(projection: string): UOM {
    const uom = proj4.defs(projection).units ?? "m"
    if (isUOM(uom)) return uom
    return "m"
}

export function getProjectionScale(projection: string, resolution: number) {
    const units = getUnits(projection)
    const dpu = (METERS_PER_UNIT[units] * 96.0 * 100.0) / 2.54
    return resolution * dpu
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
