import { useEffect, useRef, useState } from "preact/hooks"
import { cloneElement, ComponentChildren, toChildArray, VNode } from "preact"
import "./box/box.css"

export type CSSProperties = string | { [key: string]: string | number }

export type Rectangle = {
    top: string
    left: string
    width: string
    height: string
}

type BoxProps = {
    id: string
    selected: boolean
    rect: Rectangle
    stylable?: boolean
    boxStyle?: CSSProperties
    lockable?: boolean
    initiallyLocked?: boolean
    onSelect: (id: string) => void
    children: ComponentChildren
    zoom: number
}

type DragState = {
    startingPoint?: {
        x: number
        y: number
    }
    fromPoint?: {
        x: number
        y: number
    }
}

function Box({
    id,
    onSelect,
    children,
    rect,
    stylable = false,
    lockable = false,
    initiallyLocked = false,
    boxStyle = {},
    selected = false,
    zoom,
}: BoxProps) {
    const box = useRef<HTMLDivElement | null>(null)
    const dragState = useRef<DragState>({})
    const dragListener = useRef<(e: MouseEvent) => void | undefined>()
    const [locked, setLocked] = useState(initiallyLocked)

    function toggleLock() {
        setLocked((actual) => !actual)
    }

    function onMouseDown(e: MouseEvent) {
        if (e.button === 2) {
            document.body.classList.add("no-select")
            dragState.current = {
                startingPoint: {
                    x: e.clientX,
                    y: e.clientY,
                },
                fromPoint: {
                    x: box.current?.offsetLeft ?? 0,
                    y: box.current?.offsetTop ?? 0,
                },
            }
            document.addEventListener("mousemove", onMouseMove)
            document.addEventListener("mouseup", onMouseUp)
        }
    }

    function onMouseMove(e: MouseEvent) {
        const state = dragState.current
        if (state.fromPoint && state.startingPoint) {
            const offset = {
                x: (e.clientX - state.startingPoint.x) / zoom,
                y: (e.clientY - state.startingPoint.y) / zoom,
            }
            const newPoint = {
                x: state.fromPoint.x + offset.x,
                y: state.fromPoint.y + offset.y,
            }
            if (box.current?.style) {
                box.current.style.left = newPoint.x + "px"
                box.current.style.top = newPoint.y + "px"
            }
        }
    }

    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
        dragState.current = {}
        document.body.classList.remove("no-select")
    }

    useEffect(() => {
        if (box.current) {
            if (dragListener.current) {
                box.current.removeEventListener(
                    "mousedown",
                    dragListener.current
                )
            }
            box.current.addEventListener("mousedown", onMouseDown)
            box.current.addEventListener("contextmenu", (e) =>
                e.preventDefault()
            )
            dragListener.current = onMouseDown
        }
    }, [box.current, zoom])
    const style = {
        ...rect,
    }
    const additionalStyle = stylable ? boxStyle : {}
    const innerComponents = toChildArray(children).map((e) =>
        cloneElement(e as VNode, { locked })
    )
    return (
        <div
            id={`${id}-container`}
            className={`resizable draggable box ${selected ? "selected" : ""} ${
                locked ? "locked" : ""
            }`}
            ref={box}
            style={{ ...style, ...(additionalStyle as object) }}
            onClick={() => onSelect(id)}
        >
            {lockable ? (
                <div
                    className={`lock ${locked ? "locked" : "unlocked"}`}
                    onClick={toggleLock}
                ></div>
            ) : null}
            <div className="box-content">{innerComponents}</div>
        </div>
    )
}

export default Box
