import { createContext } from "preact"
import { useContext } from "preact/hooks"
import { MapConfig } from "../api/context"

export type MapProvider = {
    create: (id: string, mapConfig: MapConfig["map"]) => MapInstance
}

export type OnMouseMovePayload = {
    x: number
    y: number
    z?: number
    crs: string
}

export type EventPayload = OnMouseMovePayload

export type MapInstance = {
    map?: unknown
    setZoom: (zoom: number) => void
    getZoom: () => number | undefined
    addControl: (control: unknown) => void
    removeControl: (control: unknown) => void
    setLayerVisibility: (id: string, visibility: boolean) => void
    setLayerOpacity: (id: string, opacity: number) => void
    setBackground: (id: string) => void
    addListener: (
        event: string,
        listener: (eventPayload: EventPayload) => void
    ) => void
}

export const Map = createContext<MapInstance | null>(null)

export function useMap() {
    return useContext(Map)
}

export function loadProvider(mapType: string): Promise<MapProvider> {
    return import(`./map/${mapType}-map.ts`).then((p) => p.default)
}
