import { useEffect, useRef, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { Map, MapInstance } from "../core/map"
import { loadLocale, Locale } from "../api/locale"
import MapViewer from "../plugins/map"
import "./printer.css"
import Box from "./box"

type ContextPrinterProps = {
    context: Context
}

export default function ContextPrinter({ context }: ContextPrinterProps) {
    const [map, setMap] = useState<MapInstance | null>(null)

    const [locale, setLocale] = useState<Locale | undefined>()
    useEffect(() => {
        if (context.windowTitle) {
            document.title = context.windowTitle
        }
        loadLocale().then(setLocale)
    }, [context])

    // draggable: https://codepen.io/2bt/pen/pwELaR
    function resize() {
        if (map) map.resize()
    }
    return (
        <Locale.Provider value={locale}>
            <Map.Provider value={map}>
                <div className="sheet">
                    <Box id="map-container" onResize={resize}>
                        <MapViewer
                            setMap={setMap}
                            context={context}
                            mapType="ol"
                            plugins={[]}
                            allPlugins={[]}
                            cfg={{}}
                        />
                    </Box>
                </div>
            </Map.Provider>
        </Locale.Provider>
    )
}
