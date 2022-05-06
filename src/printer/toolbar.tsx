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
            <button onClick={addPage} title="Add a page">
                P+
            </button>
            <button
                disabled={selectedPage === 0}
                onClick={removePage}
                title="Remove selected page"
            >
                P-
            </button>
            <button onClick={toggleOrientation} title="Toggle page orientation">
                {orientation === "portrait" ? "-" : "|"}
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
                S
            </button>
            <button
                disabled={!editingText}
                onClick={align("left")}
                title="Justify left"
            >
                L
            </button>
            <button
                disabled={!editingText}
                onClick={align("center")}
                title="Center"
            >
                C
            </button>
            <button
                disabled={!editingText}
                onClick={align("right")}
                title="Justify right"
            >
                R
            </button>
            <button
                disabled={!editingText}
                onClick={textStyle("bold")}
                title="Apply bold"
            >
                B
            </button>
            <button
                disabled={!editingText}
                onClick={textStyle("italic")}
                title="Apply italic"
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
            >
                T
            </button>
            <button
                onClick={() => addComponent("scale")}
                title="Add a scale box to the page"
            >
                S
            </button>
        </div>
    )
}
