import { createContext } from "preact"
import OLMap from "ol/Map"
import { MutableRef, useContext } from "preact/hooks"

export const Map = createContext<MutableRef<OLMap | null> | null>(null)

export function useMap() {
    return useContext(Map)
}
