import { PluginProps } from "../core/plugins"
import PluginsContainer from "../viewer/plugins-container"
import "./toolbar/toolbar.css"

type ToolbarPluginProps = PluginProps

export default function Toolbar(props: ToolbarPluginProps) {
    return (
        <div className="mappette-toolbar">
            <PluginsContainer {...props} />
        </div>
    )
}
