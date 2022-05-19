import { MapEvent, MapEventType, MapProvider } from "../map"
import { getProjectionScale, reproject } from "../projection"

import "./cesium/layers/all"

// @ts-ignore
window.CESIUM_BASE_URL = "node_modules/cesium/Build/Cesium"

import "cesium/Build/Cesium/Widgets/widgets.css"
import { createLayers, ImageryProviderWithId } from "./cesium/layers"
import CesiumWidget from "cesium/Source/Widgets/CesiumWidget/CesiumWidget"
import Cartesian3 from "cesium/Source/Core/Cartesian3"
import Ellipsoid from "cesium/Source/Core/Ellipsoid"
import ImageryLayer from "cesium/Source/Scene/ImageryLayer"
import Cartographic from "cesium/Source/Core/Cartographic"
import Color from "cesium/Source/Core/Color"
import ScreenSpaceEventHandler from "cesium/Source/Core/ScreenSpaceEventHandler"
import { ScreenSpaceEventType } from "../../types/cesium"

export const zoomToHeight = 80000000

function getHeightFromZoom(zoom: number) {
    return zoomToHeight / Math.pow(2, zoom - 1)
}

function getZoomFromHeight(height: number) {
    return Math.log2(zoomToHeight / height) + 1
}

function getCartesian(viewer: CesiumWidget, event: any) {
    if (event.position !== null) {
        const scene = viewer.scene
        const ellipsoid = scene.globe.ellipsoid
        const cartesian = scene.camera.pickEllipsoid(
            event.position || event.endPosition,
            ellipsoid
        )
        return cartesian
    }
    return null
}

function getMouseXYZ(viewer: CesiumWidget, event: any) {
    var scene = viewer.scene
    const mousePosition = event.position || event.endPosition
    if (!mousePosition) {
        return null
    }
    const ray = viewer.camera.getPickRay(mousePosition)
    if (ray) {
        const position = viewer.scene.globe.pick(ray, viewer.scene)
        const ellipsoid = scene.globe.ellipsoid
        if (position) {
            const cartographic = ellipsoid.cartesianToCartographic(position)
            const cartesian = getCartesian(viewer, event)
            if (cartesian) {
                cartographic.height = scene.globe.getHeight(cartographic) ?? 0
            }
            return cartographic
        }
    }

    return null
}

type CesiumMapListener = {
    event: ScreenSpaceEventType.LEFT_CLICK | ScreenSpaceEventType.MOUSE_MOVE
    handler: (e: unknown) => unknown
}

type CesiumMapListeners = {
    [key: number]: CesiumMapListener
}

const listeners: CesiumMapListeners = {}

const managedEvents: {
    [key: string]: CesiumMapListener["event"]
} = {
    mousemove: ScreenSpaceEventType.MOUSE_MOVE,
    click: ScreenSpaceEventType.LEFT_CLICK,
}

function createWrapper(
    event: MapEventType,
    listener: (eventPayload: MapEvent) => void,
    map: CesiumWidget
) {
    return (movement: any) => {
        if (event === "click" || event === "mousemove") {
            const cartesian = map.camera.pickEllipsoid(
                movement.endPosition ?? movement.position,
                map.scene.globe.ellipsoid
            )
            let cartographic =
                getMouseXYZ(map, movement) ||
                (cartesian && Cartographic.fromCartesian(cartesian))
            if (cartographic) {
                const elevation = Math.round(cartographic.height)
                const latitude = (cartographic.latitude * 180.0) / Math.PI
                const longitude = (cartographic.longitude * 180.0) / Math.PI
                const zoom = getMapZoom(map)
                const y = ((90.0 - latitude) / 180.0) * 512 * (zoom + 1)
                const x = ((180.0 + longitude) / 360.0) * 512 * (zoom + 1)

                listener({
                    type: event,
                    pixel: {
                        x,
                        y,
                    },
                    coordinate: {
                        y: latitude,
                        x: longitude,
                        z: elevation,
                        crs: "EPSG:4326",
                    },
                })
            }
        }
    }
}

function addListener(
    event: CesiumMapListener["event"],
    listener: (e: unknown) => void
) {
    const key = Object.keys(listeners).length + 1
    listeners[key] = {
        event,
        handler: listener,
    }
    return key
}

function getMapZoom(map: CesiumWidget): number {
    const cartographic = new Cartographic()
    Ellipsoid.WGS84.cartesianToCartographic(map.camera.position, cartographic)
    return getZoomFromHeight(cartographic.height)
}

function getResolutions() {
    const size = 360 / 256
    const resolutions = new Array(19)
    for (let z = 0; z < 19; ++z) {
        resolutions[z] = size / Math.pow(2, z)
    }
    return resolutions
}

const resolutions = getResolutions()

const CesiumMapProvider: MapProvider = {
    create: (id, mapConfig) => {
        const center = reproject(mapConfig.center, "EPSG:4326")
        const map = new CesiumWidget(id, {
            creditContainer:
                document.querySelector(".mapstore-attribution") ?? undefined,
        })
        map.scene.globe.baseColor = Color.WHITE
        map.imageryLayers.removeAll()
        createLayers(mapConfig.layers, mapConfig.sources).forEach((l) =>
            map.imageryLayers.addImageryProvider(l)
        )
        const hand = new ScreenSpaceEventHandler(map.scene.canvas)
        // turn off all layers with visibility false
        mapConfig.layers
            .filter((l) => !l.visibility)
            .forEach((l) =>
                findLayer(map, l.id).and((layer) => (layer.show = false))
            )
        map.camera.setView({
            destination: Cartesian3.fromDegrees(
                center.x,
                center.y,
                getHeightFromZoom(mapConfig.zoom)
            ),
        })
        return {
            map,
            setZoom: (zoom) => {
                const cartographic = new Cartographic()
                Ellipsoid.WGS84.cartesianToCartographic(
                    map.camera.position,
                    cartographic
                )
                map.camera.setView({
                    destination: Cartesian3.fromRadians(
                        cartographic.longitude,
                        cartographic.latitude,
                        getHeightFromZoom(zoom)
                    ),
                })
            },
            getZoom: () => {
                return getMapZoom(map)
            },
            getResolution: () => resolutions[Math.round(getMapZoom(map))],
            addControl: (control: unknown) => {},
            removeControl: (control: unknown) => {},
            setLayerVisibility: (id: string, visibility: boolean) => {
                findLayer(map, id).and((l) => (l.show = visibility))
            },
            getLayerVisibility: (id) =>
                findLayer(map, id).and((l) => l.show) as boolean,
            setLayerOpacity: (id: string, opacity: number) => {
                findLayer(map, id).and((l) => (l.alpha = opacity))
            },
            getLayerOpacity: (id: string) =>
                findLayer(map, id).and((l) => l.alpha) as number,
            setBackground: (id: string) => {
                findLayer(map, id).and((l) => (l.show = true))
                findLayers(
                    map,
                    (l) =>
                        l.mapstoreGroupId === "background" &&
                        l.mapstoreId !== id
                ).and((layers) => layers.forEach((l) => (l.show = false)))
            },
            addListener: (event, listener) => {
                const cesiumEvent = managedEvents[event]
                if (cesiumEvent) {
                    const listenerWrapper = createWrapper(event, listener, map)
                    hand.setInputAction(listenerWrapper, cesiumEvent)
                    return addListener(cesiumEvent, listenerWrapper)
                }
                return 0
            },
            removeListener(listener) {
                if (listeners[listener]) {
                    hand.removeInputAction(listeners[listener].event)
                    delete listeners[listener]
                }
            },
            getProjection: () => "EPSG:4326",
            resize: () => {},
            setLocked: () => {},
        }
    },
}

function findLayer(map: CesiumWidget, id: string) {
    let layer: ImageryLayer | undefined
    for (let i = 0; i < map.imageryLayers.length; i++) {
        const candidate = map.imageryLayers.get(i)
        const provider = candidate.imageryProvider as ImageryProviderWithId
        if (provider?.mapstoreId === id) {
            layer = candidate
        }
    }
    return {
        and: (callback: (layer: ImageryLayer) => unknown) => {
            if (layer) return callback(layer)
        },
    }
}

function findLayers(
    map: CesiumWidget,
    predicate: (provider: ImageryProviderWithId) => boolean
) {
    let layers: ImageryLayer[] = []
    for (let i = 0; i < map.imageryLayers.length; i++) {
        const candidate = map.imageryLayers.get(i)
        const provider = candidate.imageryProvider as ImageryProviderWithId
        if (predicate(provider)) {
            layers.push(candidate)
        }
    }
    return {
        and: (callback: (layers: ImageryLayer[]) => void) => {
            callback(layers)
        },
    }
}

export default CesiumMapProvider
