import { EventPayload, MapProvider } from "../map"
import { reproject } from "../projection"
import OLMap from "ol/Map"
import View from "ol/View"
import { createLayers } from "./ol/layers"
import "ol/ol.css"
import "./ol/layers/all"
import Control from "ol/control/Control"
import { MapBrowserEvent } from "ol"

type OLMapListener = {
    event: "click" | "pointermove"
    handler: (e: MapBrowserEvent<MouseEvent>) => unknown
}

type OLMapListeners = {
    [key: number]: OLMapListener
}

let listeners: OLMapListeners = {}

const managedEvents: {
    [key: string]: OLMapListener["event"]
} = {
    mousemove: "pointermove",
    click: "click",
}

function createWrapper(
    listener: (eventPayload: EventPayload) => void,
    projection: string
) {
    return (e: MapBrowserEvent<MouseEvent>) =>
        listener({
            x: e.coordinate[0],
            y: e.coordinate[1],
            crs: projection,
        })
}

function addListener(
    event: OLMapListener["event"],
    listener: (e: MapBrowserEvent<MouseEvent>) => void
) {
    const key = Object.keys(listeners).length + 1
    listeners = {
        ...listeners,
        [key]: {
            event,
            handler: listener,
        },
    }
    return key
}

const OLMapProvider: MapProvider = {
    create: (id, mapConfig) => {
        const projection = mapConfig.projection ?? "EPSG:3857"
        const center = reproject(mapConfig.center, projection)
        const map = new OLMap({
            target: id,
            controls: [],
            view: new View({
                center: [center.x, center.y],
                projection,
                zoom: mapConfig.zoom,
            }),
            layers: createLayers(
                mapConfig.layers,
                projection,
                mapConfig.sources
            ),
        })
        return {
            map,
            setZoom: (zoom) => map.getView().setZoom(zoom),
            getZoom: () => map.getView().getZoom(),
            addControl: (control: unknown) =>
                map.addControl(control as Control),
            removeControl: (control: unknown) =>
                map.removeControl(control as Control),
            setLayerVisibility: (id: string, visibility: boolean) => {
                map.getLayers().forEach((l) => {
                    if (l.get("mapstore_id") === id) {
                        l.setVisible(visibility)
                    }
                })
            },
            setLayerOpacity: (id: string, opacity: number) => {
                map.getLayers().forEach((l) => {
                    if (l.get("mapstore_id") === id) {
                        l.setOpacity(opacity)
                    }
                })
            },
            setBackground: (id: string) => {
                map.getLayers().forEach((l) => {
                    if (l.get("mapstore_id") === id) {
                        l.setVisible(true)
                    } else if (l.get("mapstore_group_id") === "background") {
                        l.setVisible(false)
                    }
                })
            },
            addListener: (event, listener) => {
                const olEvent = managedEvents[event]
                if (olEvent) {
                    const listenerWrapper = createWrapper(listener, projection)
                    map.on(olEvent, listenerWrapper)
                    return addListener(olEvent, listenerWrapper)
                }
                return 0
            },
            removeListener(listener) {
                if (listeners[listener]) {
                    map.un(
                        listeners[listener].event,
                        listeners[listener].handler
                    )
                }
            },
        }
    },
}

export default OLMapProvider
