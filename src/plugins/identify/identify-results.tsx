import { MapLayer } from "../../api/context"
import { createPortal } from "preact/compat"

export type FeatureCollection = {
    type: "FeatureCollection"
    features: Feature[]
}

export type Feature = {
    type: "Feature"
    properties: {
        [key: string]: unknown
    }
}

export type Results = {
    layer: MapLayer
    features: Feature[]
}

type IdentifyResultsProps = {
    data: Results[]
    onClose: () => void
}

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

export default function IdentifyResults({
    data,
    onClose,
}: IdentifyResultsProps) {
    return createPortal(
        <div className="mapstore-identify-results">
            <div className="header">
                <span onClick={onClose}>X</span>
                <h1>Objects on point</h1>
            </div>
            <div className="body">
                {data.map((i) => (
                    <>
                        <h1>{getTitle(i.layer)}</h1>
                        {i.features.map((f) => (
                            <div>{showFeature(f)}</div>
                        ))}
                    </>
                ))}
            </div>
        </div>,
        document.getElementById("modals") as HTMLElement
    )
}
