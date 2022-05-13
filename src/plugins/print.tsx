import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"

type PrintPluginProps = PluginProps

export default function Print({}: PrintPluginProps) {
    function openPrint() {
        const url = new URL(window.location.href)
        url.pathname = "/print.html"
        window.location.href = url.href
    }
    return (
        <ToolbarButton
            id="print"
            tooltip="printToolTip"
            onClick={openPrint}
            icon="print"
        />
    )
}

export const container = "toolbar"
