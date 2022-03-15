import { PluginProps } from "../core/plugins"

type ZoomInPluginProps = PluginProps

export default function ZoomIn({ map }: ZoomInPluginProps) {
    function zoomIn() {
        if (map.current) {
            map.current
                .getView()
                .setZoom((map.current.getView().getZoom() ?? 0) + 1)
        }
    }
    return (
        <button
            id="zoomin"
            className="toolbar-button zoomin-button"
            onClick={zoomIn}
        >
            <span className="glyphicon glyphicon-plus"></span>
        </button>
    )
}

export const container = "toolbar"
