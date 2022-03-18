import { useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"

type ZoomOutPluginProps = PluginProps

export default function ZoomOut({}: ZoomOutPluginProps) {
    const map = useMap()
    function zoomOut() {
        if (map?.current) {
            map.current
                .getView()
                .setZoom((map.current.getView().getZoom() ?? 0) - 1)
        }
    }
    return (
        <ToolbarButton
            id="zoomout"
            tooltip="zoombuttons.zoomOutTooltip"
            onClick={zoomOut}
            icon="minus"
        />
    )
}

export const container = "toolbar"
