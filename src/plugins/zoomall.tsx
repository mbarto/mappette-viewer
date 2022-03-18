import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"

type ZoomAllPluginProps = PluginProps

export default function ZoomAll({ map }: ZoomAllPluginProps) {
    function zoomAll() {
        if (map.current) {
            map.current.getView().setZoom(0)
        }
    }
    return (
        <ToolbarButton
            id="zoomall"
            tooltip="zoombuttons.zoomAllTooltip"
            onClick={zoomAll}
            icon="resize-full"
        />
    )
}

export const container = "toolbar"
