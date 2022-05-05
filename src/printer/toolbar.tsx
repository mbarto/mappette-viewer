import "./toolbar/toolbar.css"

const formatBlock = (format?: string) => () => {
    document.execCommand("formatBlock", false, format)
}

const align =
    (position: string = "left") =>
    () => {
        document.execCommand("justify" + position, false)
    }

type ToolbarProps = {
    addPage: () => void
    removePage: () => void
    addComponent: (type: string) => void
    toggleOrientation: () => void
    toggleSheet: () => void
    orientation: string
    sheet: string
}

export default function Toolbar({
    addPage,
    removePage,
    addComponent,
    toggleOrientation,
    toggleSheet,
    sheet = "A4",
    orientation = "portrait",
}: ToolbarProps) {
    return (
        <div className="toolbar">
            <button onClick={addPage}>P+</button>
            <button onClick={removePage}>P-</button>
            <button onClick={toggleOrientation}>
                {orientation === "portrait" ? "-" : "|"}
            </button>
            <button onClick={toggleSheet}>{sheet}</button>
            <hr />
            <button onClick={formatBlock("h1")}>H1</button>
            <button onClick={formatBlock("h2")}>H2</button>
            <button onClick={formatBlock("div")}>S</button>
            <button onClick={align("left")}>L</button>
            <button onClick={align("center")}>C</button>
            <button onClick={align("right")}>R</button>
            <hr />
            <button onClick={() => addComponent("text")}>T</button>
        </div>
    )
}
