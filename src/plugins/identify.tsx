import { useEffect, useRef, useState } from "preact/hooks"
import { MapLayer } from "../api/context"
import { MapInstance, OnClickEvent, useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"
import layers from "../core/layers/all"
import "./identify/identify.css"

type IdentifyPluginProps = PluginProps

type Results = {
    layer: MapLayer
    features: Feature[]
}

type FeatureCollection = {
    type: "FeatureCollection"
    features: Feature[]
}

type Feature = {
    type: "Feature"
    properties: {
        [key: string]: unknown
    }
}

type IdentifyResultsProps = {
    data: Results[]
    onClose: () => void
}

function IdentifyResults({ data, onClose }: IdentifyResultsProps) {
    return (
        <div className="mapstore-identify-results">
            <div className="mapstore-identify-results-header">
                <span onClick={onClose}>X</span>
            </div>
            <div>
                {data.map((i) => (
                    <>
                        <h1>{getTitle(i.layer)}</h1>
                        {i.features.map((f) => showFeature(f))}
                    </>
                ))}
            </div>
        </div>
    )
}

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
            layers.map((l) => import(`../core/layers/${l}/identify`))
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

function getTitle(layer: MapLayer): string {
    if (typeof layer.title === "string") return layer.title
    return layer.title?.["default"] ?? ""
}
function showFeature(f: Feature) {
    return Object.keys(f.properties).map((prop) => (
        <div>
            {prop}: {f.properties[prop]}
        </div>
    ))
}
