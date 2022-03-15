import { PluginProps } from "../core/plugins"

type ZoomAllPluginProps = PluginProps

export default function ZoomOut({ map }: ZoomAllPluginProps) {
    function zoomAll() {
        if (map.current) {
            map.current.getView().setZoom(0)
        }
    }
    return (
        <button
            onClick={zoomAll}
            id="zoomall"
            className="toolbar-button zoomall-button"
        >
            <span className="glyphicon glyphicon-resize-full"></span>
        </button>
    )
}

export const container = "toolbar"
