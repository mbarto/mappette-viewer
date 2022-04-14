import { useEffect, useRef, useState } from "preact/hooks"
import { useMessage } from "../api/locale"
import { OnMouseMovePayload, useMap } from "../core/map"
import { PluginProps } from "../core/plugins"
import { reproject } from "../core/projection"
import "./mouseposition/mouseposition.css"

type MousePositionPluginProps = PluginProps

function pad(val: number, digits: number): string {
    return (
        (Math.sign(val) === -1 ? "-" : "") +
        String(Math.abs(val)).padStart(digits, "0")
    )
}

function toDegrees(val: number, degDigits: number): string {
    const deg = Math.floor(val)
    const minutes = Math.floor((val - deg) * 60)
    const seconds = Math.round((val - deg - minutes / 60) * 3600)

    return `${pad(deg, degDigits)}° ${pad(minutes, 2)}' ${pad(seconds, 2)}''`
}

function format(point: OnMouseMovePayload, projection: string): string {
    const latlon = reproject(point, "EPSG:4326")
    return `Lat: ${toDegrees(latlon.y, 2)} Lng: ${toDegrees(latlon.x, 3)}`
}

export default function MousePosition({ context }: MousePositionPluginProps) {
    const [active, setActive] = useState(false)
    const [point, setPoint] = useState<OnMouseMovePayload | null>(null)
    const map = useMap()
    const label = useMessage("mouseCoordinates")
    function toggleActive() {
        setActive((a) => !a)
    }
    const listener = useRef<number | undefined>()
    useEffect(() => {
        if (map) {
            if (active) {
                listener.current = map.addListener("mousemove", (p) =>
                    setPoint(p)
                )
            } else {
                if (listener.current) {
                    map.removeListener(listener.current)
                }
            }
        }
    }, [active, map])
    return (
        <div className="mapstore-mouse-position">
            {active && point ? (
                <div className="coordinates">
                    <label>{label}</label>
                    <span className="mouseposition-value">
                        {format(
                            point,
                            context?.mapConfig?.map?.projection ?? "EPSG:3857"
                        )}
                    </span>
                </div>
            ) : null}
            <button
                onClick={toggleActive}
                className={` ${active ? "active" : ""}`}
            >
                <span className="glyphicon glyphicon-mouse"></span>
            </button>
        </div>
    )
}

export const container = "mapfooter"
