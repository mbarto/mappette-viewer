import { useMessage } from "../../api/locale"

type ToolbarButtonProps = {
    onClick: () => void
    id: string
    tooltip: string
    icon: string
    selected?: boolean
}

export default function ToolbarButton({
    onClick,
    id,
    tooltip,
    icon,
    selected = false,
}: ToolbarButtonProps) {
    const tooltipMessage = useMessage(tooltip)
    const selectedClass = selected ? "selected" : ""
    return (
        <button
            title={tooltipMessage}
            id={id}
            className={`toolbar-button ${id}-button ${selectedClass}`}
            onClick={onClick}
        >
            <span className={`glyphicon glyphicon-${icon}`}></span>
        </button>
    )
}
