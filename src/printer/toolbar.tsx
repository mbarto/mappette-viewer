import { CSSProperties } from "./box"
import "./toolbar/toolbar.css"

type ToolbarProps = {
    addPage: () => void
    removePage: () => void
    addComponent: (type: string) => void
    toggleOrientation: () => void
    toggleSheet: () => void
    applyStyle: (style: CSSProperties) => void
    selectedPage: number
    orientation: string
    sheet: string
}

export default function Toolbar({
    addPage,
    removePage,
    addComponent,
    toggleOrientation,
    toggleSheet,
    selectedPage = 0,
    sheet = "A4",
    orientation = "portrait",
    applyStyle = () => {},
}: ToolbarProps) {
    const formatBlock = (format?: string) => () => {
        document.execCommand("formatBlock", false, format)
    }

    const align =
        (position: string = "left") =>
        () => {
            document.execCommand("justify" + position, false)
            applyStyle({
                textAlign: position,
            })
        }

    const textStyle =
        (style: string = "none") =>
        () => {
            applyStyle({
                fontWeight: style === "bold" ? "bold" : "",
                fontStyle: style === "italic" ? "italic" : "",
            })
        }
    return (
        <div className="toolbar">
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
