import { EventPayload, MapProvider } from "../map"
import { reproject } from "../projection"

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
    event: 2 | 15 // ScreenSpaceEventType
    handler: (e: unknown) => unknown
}

type CesiumMapListeners = {
    [key: number]: CesiumMapListener
}

let listeners: CesiumMapListeners = {}

const managedEvents: {
    [key: string]: CesiumMapListener["event"]
} = {
    mousemove: 15,
    click: 2,
}

function createWrapper(
    listener: (eventPayload: EventPayload) => void,
    map: CesiumWidget
) {
    return (movement: any) => {
        const cartesian = map.camera.pickEllipsoid(
            movement.endPosition ?? movement.position,
            map.scene.globe.ellipsoid
        )
        let cartographic =
            getMouseXYZ(map, movement) ||
            (cartesian && Cartographic.fromCartesian(cartesian))
        if (cartographic) {
            const elevation = Math.round(cartographic.height)
            listener({
                y: (cartographic.latitude * 180.0) / Math.PI,
                x: (cartographic.longitude * 180.0) / Math.PI,
                z: elevation,
                crs: "EPSG:4326",
            })
        }
    }
}

function addListener(
    event: CesiumMapListener["event"],
    listener: (e: unknown) => void
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
                const cartographic = new Cartographic()
                Ellipsoid.WGS84.cartesianToCartographic(
                    map.camera.position,
                    cartographic
                )
                return getZoomFromHeight(cartographic.height)
            },
            addControl: (control: unknown) => {},
            removeControl: (control: unknown) => {},
            setLayerVisibility: (id: string, visibility: boolean) => {
                findLayer(map, id).and((l) => (l.show = visibility))
            },
            setLayerOpacity: (id: string, opacity: number) => {
                findLayer(map, id).and((l) => (l.alpha = opacity))
            },
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
                    const listenerWrapper = createWrapper(listener, map)
                    hand.setInputAction(listenerWrapper, cesiumEvent)
                    return addListener(cesiumEvent, listenerWrapper)
                }
                return 0
            },
            removeListener(listener) {
                if (listeners[listener]) {
                    hand.removeInputAction(listeners[listener].event)
                }
            },
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
        and: (callback: (layer: ImageryLayer) => void) => {
            if (layer) callback(layer)
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
