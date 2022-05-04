import { useEffect, useRef, useState } from "preact/hooks"
import { ComponentChildren } from "preact"
import "./box/box.css"
type BoxProps = {
    id: string
    onResize: () => void
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

function Box({ id, onResize, children }: BoxProps) {
    const box = useRef<HTMLDivElement | null>(null)
    const dragState = useRef<DragState>({})
    useEffect(() => {
        if (box.current) {
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
    return (
        <div id={id} className="resizable draggable" ref={box}>
            {children}
        </div>
    )
}

export default Box
