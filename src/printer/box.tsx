import { useEffect, useRef } from "preact/hooks"
import { ComponentChildren } from "preact"
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
    onResize?: () => void
    onSelect: (id: string) => void
    children: ComponentChildren
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
    onResize,
    onSelect,
    children,
    rect,
    stylable = false,
    boxStyle = {},
    selected = false,
}: BoxProps) {
    const box = useRef<HTMLDivElement | null>(null)
    const dragState = useRef<DragState>({})
    useEffect(() => {
        if (box.current && onResize) {
            const observer = new ResizeObserver(onResize)
            observer.observe(box.current)
            return () => observer.disconnect()
        }
    }, [box.current])

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
                x: e.clientX - state.startingPoint.x,
                y: e.clientY - state.startingPoint.y,
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
            box.current.addEventListener("mousedown", onMouseDown)
            box.current.addEventListener("contextmenu", (e) =>
                e.preventDefault()
            )
        }
    }, [box.current])
    const style = {
        ...rect,
    }
    const additionalStyle = stylable ? boxStyle : {}
    return (
        <div
            id={`${id}-container`}
            className={`resizable draggable box ${selected ? "selected" : ""}`}
            ref={box}
            style={{ ...style, ...(additionalStyle as object) }}
            onClick={() => onSelect(id)}
        >
            {children}
        </div>
    )
}

export default Box
