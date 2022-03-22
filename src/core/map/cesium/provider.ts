import { MapProvider } from "../../map"
import { reproject } from "../../projection"
import {
    Viewer,
    OpenStreetMapImageryProvider,
    Cartesian3,
    Ellipsoid,
    Cartographic,
} from "cesium"
import "./layers/all"

// @ts-ignore
window.CESIUM_BASE_URL = "node_modules/cesium/Build/Cesium"

import "cesium/Build/Cesium/Widgets/widgets.css"
import { createLayers, ImageryProviderWithId } from "./layers"
import ImageryLayer from "cesium/Source/Scene/ImageryLayer"

export const zoomToHeight = 80000000

function getHeightFromZoom(zoom: number) {
    return zoomToHeight / Math.pow(2, zoom - 1)
}

function getZoomFromHeight(height: number) {
    return Math.log2(zoomToHeight / height) + 1
}

const CesiumMapProvider: MapProvider = {
    create: (id, mapConfig) => {
        const center = reproject(mapConfig.center, "EPSG:4326")
        const map = new Viewer(id, {
            baseLayerPicker: false,
            animation: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            creditContainer:
                document.querySelector(".mapstore-attribution") ?? undefined,
        })
        const layers = createLayers(mapConfig.layers)
        layers.forEach((l) => map.imageryLayers.addImageryProvider(l))
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
        }
    },
}

function findLayer(map: Viewer, id: string) {
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

export default CesiumMapProvider
