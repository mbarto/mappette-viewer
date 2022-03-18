import { PluginProps } from "../core/plugins"
import PluginsContainer from "../viewer/plugins-container"
import "./toolbar/toolbar.css"

type ToolbarPluginProps = PluginProps

export default function Toolbar(props: ToolbarPluginProps) {
    return (
        <div className="mapstore-toolbar">
            <PluginsContainer {...props} />
        </div>
    )
}
