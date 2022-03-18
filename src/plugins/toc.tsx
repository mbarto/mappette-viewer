import { useState } from "preact/hooks"
import { PluginProps } from "../core/plugins"
import ToolbarButton from "./toolbar/toolbar-button"
import "./toc/toc.css"

type TableOfContentsProps = PluginProps

export default function TableOfContents(props: TableOfContentsProps) {
    const [status, setStatus] = useState("")
    function toggle() {
        setStatus((s) => (s !== "open" ? "open" : "closed"))
    }
    return (
        <>
            <ToolbarButton
                id="toc"
                icon="1-layer"
                tooltip="layers"
                onClick={toggle}
            />
            <div className={`mapstore-table-of-contents ${status}`}>
                <div className="toc-header">
                    <span
                        className="toc-close glyphicon glyphicon-1-close"
                        onClick={toggle}
                    ></span>
                    <span className="toc-icon glyphicon glyphicon-1-layer"></span>
                </div>
            </div>
        </>
    )
}
