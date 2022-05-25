import { MapEvent, MapEventType, MapProvider } from "../map"
import { reproject } from "../projection"
import OLMap from "ol/Map"
import View from "ol/View"
import { createLayers } from "./ol/layers"
import "ol/ol.css"
import "./ol/layers/all"
import Control from "ol/control/Control"
import { MapBrowserEvent, MapEvent as OLMapEvent } from "ol"
import BaseLayer from "ol/layer/Base"

type OLMapListener =
    | {
          event: "click"
          handler: (e: MapBrowserEvent<MouseEvent>) => unknown
      }
    | {
          event: "pointermove"
          handler: (e: MapBrowserEvent<MouseEvent>) => unknown
      }
    | {
          event: "moveend"
          handler: (e: OLMapEvent) => unknown
      }

type OLMapListeners = {
    [key: number]: OLMapListener
}

const listeners: OLMapListeners = {}

function addListenerToMap(
    event: MapEventType,
    listener: (eventPayload: MapEvent) => void,
    map: OLMap,
    projection: string
): OLMapListener {
    if (event === "click") {
        const handler = (e: MapBrowserEvent<MouseEvent>) =>
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

        map.on("click", handler)
        return { event: "click", handler }
    }
    if (event === "mousemove") {
        const handler = (e: MapBrowserEvent<MouseEvent>) =>
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
        map.on("pointermove", handler)
        return { event: "pointermove", handler }
    }
    // moveend
    const handler = (e: OLMapEvent) =>
        listener({
            type: "zoom",
            zoom: e.map.getView().getZoom() ?? 0,
        })
    map.on("moveend", handler)
    return { event: "moveend", handler }
}

function addListener(listener: OLMapListener) {
    const key = Object.keys(listeners).length + 1
    listeners[key] = listener
    return key
}

function getLayer(map: OLMap, id: string): BaseLayer | null {
    let result = null
    map.getLayers().forEach((l) => {
        if (l.get("map_id") === id) {
            result = l
        }
    })
    return result
}

const OLMapProvider: MapProvider = {
    create: (id, mapConfig, locked) => {
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
        const defaultInteractions = map
            .getInteractions()
            .getArray()
            .map((i) => i)
        if (locked) {
            map.getInteractions().clear()
        }
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
            getLayerOpacity: (id: string) =>
                getLayer(map, id)?.getOpacity() ?? 1,
            setBackground: (id: string) => {
                map.getLayers().forEach((l) => {
                    if (l.get("map_id") === id) {
                        l.setVisible(true)
                    } else if (l.get("map_group_id") === "background") {
                        l.setVisible(false)
                    }
                })
            },
            addListener: (event, listener) => {
                const olListener = addListenerToMap(
                    event,
                    listener,
                    map,
                    projection
                )
                return addListener(olListener)
            },
            removeListener(listener) {
                if (listeners[listener]) {
                    const { event, handler } = listeners[listener]
                    if (event === "click" || event === "pointermove") {
                        map.un(event, handler)
                    }
                    if (event === "moveend") {
                        map.un("moveend", handler)
                    }
                    delete listeners[listener]
                }
            },
            getProjection: () => projection,
            resize: () => map.updateSize(),
            setLocked: (locked: boolean) => {
                if (locked) map.getInteractions().clear()
                else defaultInteractions.forEach((i) => map.addInteraction(i))
            },
        }
    },
}

export default OLMapProvider
