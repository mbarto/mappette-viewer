import "./toolbar/toolbar.css"

type ToolbarProps = {
    addPage: () => void
    removePage: () => void
    addComponent: (type: string) => void
    toggleOrientation: () => void
    toggleSheet: () => void
    applyStyle: (style: object) => void
    selectedPage: number
    orientation: string
    sheet: string
    editingText: boolean
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
    editingText = false,
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
            <button disabled={!editingText} onClick={formatBlock("h1")}>
                H1
            </button>
            <button disabled={!editingText} onClick={formatBlock("h2")}>
                H2
            </button>
            <button
                disabled={!editingText}
                onClick={formatBlock("div")}
                title="Remove titles"
            >
                N
            </button>
            <hr />
            <button
                disabled={!editingText}
                onClick={align("left")}
                title="Justify left"
                className="icon-align-left"
            ></button>
            <button
                disabled={!editingText}
                onClick={align("center")}
                title="Center"
                className="icon-align-center"
            ></button>
            <button
                disabled={!editingText}
                onClick={align("right")}
                title="Justify right"
                className="icon-align-right"
            ></button>
            <hr />
            <button
                disabled={!editingText}
                onClick={textStyle("bold")}
                title="Apply bold"
                style={{
                    fontWeight: "bold",
                }}
            >
                B
            </button>
            <button
                disabled={!editingText}
                onClick={textStyle("italic")}
                title="Apply italic"
                style={{
                    fontStyle: "italic",
                }}
            >
                I
            </button>
            <button
                disabled={!editingText}
                onClick={textStyle("none")}
                title="Remove text style"
            >
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
