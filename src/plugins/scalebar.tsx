import ScaleLine from "ol/control/ScaleLine"
import { useEffect, useRef, useState } from "preact/hooks"
import { MapInstance, useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import "./scalebar/scalebar.css"

type ScalebarPluginProps = PluginProps

export type ScalebarInstance = {
    control: unknown
    remove: () => void
}

export type ScalebarProvider = {
    create: (map: MapInstance) => ScalebarInstance
}

export default function Scalebar({ mapType }: ScalebarPluginProps) {
    const map = useMap()
    const [provider, setProvider] = useState<ScalebarProvider | null>(null)
    const scalebar = useRef<ScalebarInstance>()
    useEffect(() => {
        if (map) {
            if (provider) {
                scalebar.current = provider.create(map)
            } else {
                import(`./scalebar/${mapType}-scalebar.ts`)
                    .then((p) => setProvider(p.default))
                    .catch(() =>
                        console.warn(
                            `No scalebar implementation for ${mapType} provider`
                        )
                    )
            }
        }
        return () => {
            if (scalebar.current && map) scalebar.current.remove()
        }
    }, [map, provider])
    return <div className="mapstore-scalebar"></div>
}

export const container = "mapfooter"
