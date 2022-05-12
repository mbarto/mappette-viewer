import { createContext } from "preact"
import { useContext } from "preact/hooks"
import { MapConfig } from "../api/context"
import { Point } from "./projection"

export type MapProvider = {
    create: (id: string, mapConfig: MapConfig["map"]) => MapInstance
}

export type MapEventType = "mousemove" | "click" | "zoom"

export type BaseMapEvent = {
    type: MapEventType
}

export type EventPoint = {
    pixel: {
        x: number
        y: number
    }
    coordinate: Point
}

export type OnMouseMoveEvent = BaseMapEvent &
    EventPoint & {
        type: "mousemove"
    }

export type OnClickEvent = BaseMapEvent &
    EventPoint & {
        type: "click"
    }

export type OnZoomEvent = BaseMapEvent & {
    type: "zoom"
    zoom: number
}

export type MapEvent = OnMouseMoveEvent | OnClickEvent | OnZoomEvent

export type MapListener = number

export type MapInstance = {
    map?: unknown
    setZoom: (zoom: number) => void
    getZoom: () => number | undefined
    getResolution: () => number | undefined
    addControl: (control: unknown) => void
    removeControl: (control: unknown) => void
    setLayerVisibility: (id: string, visibility: boolean) => void
    getLayerVisibility: (id: string) => boolean
    setLayerOpacity: (id: string, opacity: number) => void
    getLayerOpacity: (id: string) => number
    setBackground: (id: string) => void
    addListener: (
        event: MapEventType,
        listener: (mapEvent: MapEvent) => void
    ) => MapListener
    removeListener: (listener: MapListener) => void
    getProjection: () => string
    resize: () => void
}

export const Map = createContext<MapInstance | null>(null)

export function useMap() {
    return useContext(Map)
}

export function loadProvider(mapType: string): Promise<MapProvider> {
    return import(`./map/${mapType}-map.ts`).then((p) => p.default)
}
