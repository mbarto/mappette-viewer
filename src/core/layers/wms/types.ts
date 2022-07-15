import { MapLayer } from "../../../api/context/context-types"

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
