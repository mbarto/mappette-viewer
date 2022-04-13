import { MapProvider } from "../map"
import { reproject } from "../projection"
import OLMap from "ol/Map"
import View from "ol/View"
import { createLayers } from "./ol/layers"
import "ol/ol.css"
import "./ol/layers/all"
import Control from "ol/control/Control"

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
                if (event === "mousemove") {
                    map.on("pointermove", (e) =>
                        listener({
                            x: e.coordinate[0],
                            y: e.coordinate[1],
                            crs: projection,
                        })
                    )
                }
            },
        }
    },
}

export default OLMapProvider
