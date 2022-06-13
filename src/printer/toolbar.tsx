import { CSSProperties } from "./box"
import { MAX_ZOOM, MIN_ZOOM } from "./context-printer"
import { ComponentTypes } from "./page"
import "./toolbar/toolbar.css"

type ToolbarProps = {
    addPage: () => void
    removePage: () => void
    addComponent: (type: ComponentTypes) => void
    removeComponent: () => void
    toggleOrientation: () => void
    toggleSheet: () => void
    print: () => void
    zoomIn: () => void
    zoomOut: () => void
    applyStyle: (style: CSSProperties) => void
    selectedPage: number
    orientation: string
    sheet: string
    zoom: number
}

export default function Toolbar({
    addPage,
    removePage,
    addComponent,
    removeComponent,
    toggleOrientation,
    toggleSheet,
    selectedPage = 0,
    sheet = "A4",
    orientation = "portrait",
    zoom = 1,
    applyStyle = () => {},
    print,
    zoomIn,
    zoomOut,
}: ToolbarProps) {
    const formatBlock = (format?: string) => () => {
        if (format === "h1") {
            applyStyle({
                fontSize: "3rem",
            })
        } else if (format === "h2") {
            applyStyle({
                fontSize: "2rem",
            })
        } else
            applyStyle({
                fontSize: "1rem",
            })
    }

    const align =
        (position: string = "left") =>
        () => {
            applyStyle({
                textAlign: position,
            })
        }

    const textStyle =
        (style: string = "none") =>
        () => {
            if (style === "bold") applyStyle({ fontWeight: "bold" })
            else if (style === "italic") applyStyle({ fontStyle: "italic" })
            else
                applyStyle({
                    fontWeight: "",
                    fontStyle: "",
                })
        }
    return (
        <div className="toolbar">
            <button onClick={print} title="Print" className="icon-print">
                <span></span>
            </button>
            <button
                onClick={zoomIn}
                disabled={zoom === MAX_ZOOM}
                title="Zoom In"
                className="icon-zoom"
            >
                <span>+</span>
            </button>
            <button
                onClick={zoomOut}
                disabled={zoom === MIN_ZOOM}
                title="Zoom Out"
                className="icon-zoom"
            >
                <span>-</span>
            </button>
            <hr />
            <button onClick={addPage} title="Add a page" className="icon-page">
                <span>+</span>
            </button>
            <button
                disabled={selectedPage === 0}
                onClick={removePage}
                title="Remove selected page"
                className="icon-page"
            >
                <span>-</span>
            </button>
            <button
                onClick={toggleOrientation}
                title="Toggle page orientation"
                className={`icon-page ${orientation}`}
            >
                <span></span>
            </button>
            <button onClick={toggleSheet} title="Toggle sheet format">
                {sheet}
            </button>
            <hr />
            <button onClick={formatBlock("h1")}>H1</button>
            <button onClick={formatBlock("h2")}>H2</button>
            <button onClick={formatBlock("div")} title="Remove titles">
                N
            </button>
            <hr />
            <button
                onClick={align("left")}
                title="Justify left"
                className="icon-align-left"
            ></button>
            <button
                onClick={align("center")}
                title="Center"
                className="icon-align-center"
            ></button>
            <button
                onClick={align("right")}
                title="Justify right"
                className="icon-align-right"
            ></button>
            <hr />
            <button
                onClick={textStyle("bold")}
                title="Apply bold"
                style={{
                    fontWeight: "bold",
                }}
            >
                B
            </button>
            <button
                onClick={textStyle("italic")}
                title="Apply italic"
                style={{
                    fontStyle: "italic",
                }}
            >
                I
            </button>
            <button onClick={textStyle("none")} title="Remove text style">
                N
            </button>
            <hr />
            <button
                onClick={removeComponent}
                title="Remove selected component"
                className="icon-remove"
            ></button>
            <button
                onClick={() => addComponent("text")}
                title="Add a text box to the page"
                style={{
                    fontSize: 12,
                }}
            >
                Text
            </button>
            <button
                onClick={() => addComponent("scale")}
                title="Add a scale box to the page"
                style={{
                    fontSize: 8,
                }}
            >
                1:100
            </button>
        </div>
    )
}
