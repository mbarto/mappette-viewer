import { createContext } from "preact"
import { useContext } from "preact/hooks"
import { MapConfig, MapLayer } from "../api/context"

export type MapProvider = {
    create: (id: string, mapConfig: MapConfig["map"]) => MapInstance
}

export type MapInstance = {
    map?: unknown
    setZoom: (zoom: number) => void
    getZoom: () => number | undefined
    addControl: (control: unknown) => void
    removeControl: (control: unknown) => void
    setLayerVisibility: (id: string, visibility: boolean) => void
    setLayerOpacity: (id: string, opacity: number) => void
    setBackground: (id: string) => void
}

export const Map = createContext<MapInstance | null>(null)

export function useMap() {
    return useContext(Map)
}

export function loadProvider(mapType: string): Promise<MapProvider> {
    return import(`./map/${mapType}/provider.ts`).then((p) => p.default)
}
