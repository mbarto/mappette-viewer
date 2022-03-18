import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"

type ZoomInPluginProps = PluginProps

export default function ZoomIn({}: ZoomInPluginProps) {
    const map = useMap()
    function zoomIn() {
        if (map?.current) {
            map.current
                .getView()
                .setZoom((map.current.getView().getZoom() ?? 0) + 1)
        }
    }
    return (
        <ToolbarButton
            id="zoomin"
            tooltip="zoombuttons.zoomInTooltip"
            onClick={zoomIn}
            icon="plus"
        />
    )
}

export const container = "toolbar"
