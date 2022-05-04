import "./toolbar/toolbar.css"

const formatBlock = (format?: string) => () => {
    document.execCommand("formatBlock", false, format)
}

const align =
    (position: string = "left") =>
    () => {
        document.execCommand("justify" + position, false)
    }

export default function Toolbar({}) {
    return (
        <div className="toolbar">
            <button onClick={formatBlock("h1")}>H1</button>
            <button onClick={formatBlock("h2")}>H2</button>
            <button onClick={formatBlock("div")}>S</button>
            <button onClick={align("left")}>L</button>
            <button onClick={align("center")}>C</button>
            <button onClick={align("right")}>R</button>
        </div>
    )
}
