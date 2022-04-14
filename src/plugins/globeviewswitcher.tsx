import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"

type GlobeViewSwitcherPluginProps = PluginProps

export default function GlobeViewSwitcher({
    mapType,
}: GlobeViewSwitcherPluginProps) {
    function switchMode() {
        const newMode = mapType === "ol" ? "3d" : "2d"
        const url = new URL(window.location.href)
        url.searchParams.delete("mode")
        url.searchParams.append("mode", newMode)
        window.location.href = url.href
    }
    const tooltip =
        mapType === "ol"
            ? "globeswitcher.tooltipActivate"
            : "globeswitcher.tooltipDeactivate"
    return (
        <ToolbarButton
            id="globeviewswitcher"
            tooltip={tooltip}
            onClick={switchMode}
            selected={mapType === "cesium"}
            icon="3d"
        />
    )
}

export const container = "toolbar"
