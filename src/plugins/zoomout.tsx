import { PluginProps } from "../core/plugins"

type ZoomOutPluginProps = PluginProps

export default function ZoomOut({ map }: ZoomOutPluginProps) {
    function zoomOut() {
        if (map.current) {
            map.current
                .getView()
                .setZoom((map.current.getView().getZoom() ?? 0) - 1)
        }
    }
    return (
        <button
            id="zoomout"
            className="toolbar-button zoomout-button"
            onClick={zoomOut}
        >
            <span className="glyphicon glyphicon-minus"></span>
        </button>
    )
}

export const container = "toolbar"
