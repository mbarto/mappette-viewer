import { MapEvent, MapEventType, MapProvider } from "../map"
import { reproject } from "../projection"
import OLMap from "ol/Map"
import View from "ol/View"
import { createLayers } from "./ol/layers"
import "ol/ol.css"
import "./ol/layers/all"
import Control from "ol/control/Control"
import { MapBrowserEvent } from "ol"
import BaseLayer from "ol/layer/Base"

type OLMapListener = {
    event: "click" | "pointermove"
    handler: (e: MapBrowserEvent<MouseEvent>) => unknown
}

type OLMapListeners = {
    [key: number]: OLMapListener
}

const listeners: OLMapListeners = {}

const managedEvents: {
    [key: string]: OLMapListener["event"]
} = {
    mousemove: "pointermove",
    click: "click",
}

function createWrapper(
    event: MapEventType,
    listener: (eventPayload: MapEvent) => void,
    projection: string
) {
    return (e: MapBrowserEvent<MouseEvent>) =>
        listener({
            type: event,
            pixel: {
                x: e.pixel[0],
                y: e.pixel[1],
            },
            coordinate: {
                x: e.coordinate[0],
                y: e.coordinate[1],
                crs: projection,
            },
        })
}

function addListener(
    event: OLMapListener["event"],
    listener: (e: MapBrowserEvent<MouseEvent>) => void
) {
    const key = Object.keys(listeners).length + 1
    listeners[key] = {
        event,
        handler: listener,
    }
    return key
}

function getLayer(map: OLMap, id: string): BaseLayer | null {
    let result = null
    map.getLayers().forEach((l) => {
        if (l.get("mapstore_id") === id) {
            result = l
        }
    })
    return result
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
            getResolution: () => map.getView().getResolution(),
            addControl: (control: unknown) =>
                map.addControl(control as Control),
            removeControl: (control: unknown) =>
                map.removeControl(control as Control),
            setLayerVisibility: (id: string, visibility: boolean) => {
                getLayer(map, id)?.setVisible(visibility)
            },
            getLayerVisibility: (id: string) =>
                getLayer(map, id)?.getVisible() ?? false,
            setLayerOpacity: (id: string, opacity: number) => {
                getLayer(map, id)?.setOpacity(opacity)
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
                    const listenerWrapper = createWrapper(
                        event,
                        listener,
                        projection
                    )
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
                    delete listeners[listener]
                }
            },
            getProjection: () => projection,
            resize: () => map.updateSize(),
        }
    },
}

export default OLMapProvider
