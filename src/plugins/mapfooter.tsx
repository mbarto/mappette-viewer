import { useLayout } from "../core/css"
import { PluginProps } from "../core/plugins"
import PluginsContainer from "../viewer/plugins-container"
import "./mapfooter/mapfooter.css"

type FooterPluginProps = PluginProps

export default function Footer(props: FooterPluginProps) {
    useLayout("footer-present", "1", [])
    return (
        <div className="mappette-map-footer">
            <PluginsContainer {...props} />
        </div>
    )
}
