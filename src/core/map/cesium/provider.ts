import { MapProvider } from "../../map"
import { reproject } from "../../projection"

import "./layers/all"

// @ts-ignore
window.CESIUM_BASE_URL = "node_modules/cesium/Build/Cesium"

import "cesium/Build/Cesium/Widgets/widgets.css"
import { createLayers, ImageryProviderWithId } from "./layers"
import CesiumWidget from "cesium/Source/Widgets/CesiumWidget/CesiumWidget"
import Cartesian3 from "cesium/Source/Core/Cartesian3"
import Ellipsoid from "cesium/Source/Core/Ellipsoid"
import ImageryLayer from "cesium/Source/Scene/ImageryLayer"
import Cartographic from "cesium/Source/Core/Cartographic"
import ImageryProvider from "cesium/Source/Scene/ImageryProvider"
import Color from "cesium/Source/Core/Color"

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
        const map = new CesiumWidget(id, {
            creditContainer:
                document.querySelector(".mapstore-attribution") ?? undefined,
        })
        map.scene.globe.baseColor = Color.WHITE
        map.imageryLayers.removeAll()
        createLayers(mapConfig.layers, mapConfig.sources).forEach((l) =>
            map.imageryLayers.addImageryProvider(l)
        )
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
