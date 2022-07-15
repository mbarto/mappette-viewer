import { useEffect, useRef, useState } from "preact/hooks"
import { MapLayer } from "../api/context-types"
import { MapInstance, OnClickEvent, useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"
import layers from "../core/layers/all"
import "./identify/identify.css"
import IdentifyResults, {
    FeatureCollection,
    Results,
} from "./identify/identify-results"

type IdentifyPluginProps = PluginProps

export default function Identify({ context }: IdentifyPluginProps) {
    const map = useMap()
    const listener = useRef<number | undefined>()
    const [selected, setSelected] = useState(true)
    const [results, setResults] = useState<Results[] | null>(null)
    const [providers, setProviders] = useState<{
        [type: string]: (
            map: MapInstance,
            layer: MapLayer,
            evt: OnClickEvent
        ) => Promise<unknown>
    }>({})

    function isQueryable(l: MapLayer): boolean {
        return !!providers[l.type]
    }

    useEffect(() => {
        Promise.all(
            layers.map((l) => import(`../core/layers/${l}/identify.ts`))
        ).then((handlers) => {
            setProviders(
                layers.reduce((acc, l, idx) => {
                    return {
                        ...acc,
                        [l]: handlers[idx].default,
                    }
                }, {})
            )
        })
    }, [])
    useEffect(() => {
        if (map) {
            if (selected) {
                listener.current = map.addListener("click", (evt) => {
                    if (selected) {
                        const layers = context.mapConfig.map.layers.filter(
                            (l) =>
                                map.getLayerVisibility(l.id) && isQueryable(l)
                        )
                        Promise.all(
                            layers.map((l) =>
                                providers[l.type](map, l, evt as OnClickEvent)
                            )
                        )
                            .then((results) => {
                                setResults(
                                    results
                                        .map((r, idx) => ({
                                            layer: layers[idx],
                                            features:
                                                (r as FeatureCollection)
                                                    .features || [],
                                        }))
                                        .filter((r) => r.features.length > 0)
                                )
                            })
                            .catch((e) => {
                                setResults(e)
                            })
                    }
                })
            } else {
                if (listener.current) {
                    map.removeListener(listener.current)
                }
            }
        }
    }, [selected, map])

    function toggleSelected() {
        setSelected((sel) => !sel)
    }
    return (
        <>
            <ToolbarButton
                id="identify"
                tooltip="info.tooltip"
                onClick={toggleSelected}
                selected={selected}
                icon="map-marker"
            />
            {results ? (
                <IdentifyResults
                    data={results}
                    onClose={() => setResults(null)}
                />
            ) : null}
        </>
    )
}

export const container = "toolbar"
