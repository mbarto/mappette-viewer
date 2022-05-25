import { useEffect, useRef, useState } from "preact/hooks"
import { MapInstance, useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import "./attribution/attribution.css"

type AttributionPluginProps = PluginProps

export type AttributionInstance = {
    control: unknown
    remove: () => void
}

export type AttributionProvider = {
    create: (map: MapInstance) => AttributionInstance
}

export default function Attribution({ mapType }: AttributionPluginProps) {
    const map = useMap()
    const [provider, setProvider] = useState<AttributionProvider | null>(null)
    const attribution = useRef<AttributionInstance>()
    useEffect(() => {
        if (map) {
            if (provider) {
                attribution.current = provider.create(map)
            } else {
                import(`./attribution/${mapType}-attribution.ts`)
                    .then((p) => setProvider(p.default))
                    .catch(() =>
                        console.warn(
                            `No attribution implementation for ${mapType} provider`
                        )
                    )
            }
        }
        return () => {
            if (attribution.current && map) attribution.current.remove()
        }
    }, [map, provider])
    return <div className="mappette-attribution"></div>
}

export const container = "mapfooter"
