import Layer from "ol/layer/Layer"
import { MapLayer } from "../api/context"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import ImageLayer from "ol/layer/Image"
import ImageWMS from "ol/source/ImageWMS"
import TileWMS from "ol/source/TileWMS"

export function createLayers(layers: MapLayer[]): Layer[] {
    return layers
        .filter((l) => l.visibility)
        .reduce((acc: Layer[], layer) => {
            const olLayer = createLayer(layer)
            if (olLayer) return [...acc, olLayer]
            return acc
        }, [])
}

export function createLayer(layer: MapLayer): Layer | null {
    if (layer.type === "osm") {
        return new TileLayer({
            source: new OSM(),
        })
    }
    if (layer.type === "wms") {
        if (layer.singleTile) {
            return new ImageLayer({
                source: new ImageWMS({
                    url: layer.url,
                    params: {
                        LAYERS: layer.name,
                        FORMAT: layer.format || "image/png",
                    },
                    ratio: 1,
                    serverType: "geoserver",
                }),
            })
        } else {
            return new TileLayer({
                source: new TileWMS({
                    url: layer.url,
                    params: {
                        LAYERS: layer.name,
                        TILED: true,
                        FORMAT: layer.format || "image/png",
                    },
                    transition: 0,
                }),
            })
        }
    }
    return null
}
