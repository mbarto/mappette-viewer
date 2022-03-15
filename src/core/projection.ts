import proj4 from "proj4"

export type Point = {
    x: number
    y: number
    crs: string
}

export function reproject(p: Point, to: string): Point {
    if (p.crs === to) return p
    return {
        ...proj4(p.crs, to).forward(p),
        crs: to,
    }
}
