import { useMessage } from "../../api/locale"

type ToolbarButtonProps = {
    onClick: () => void
    id: string
    tooltip: string
    icon: string
}

export default function ToolbarButton({
    onClick,
    id,
    tooltip,
    icon,
}: ToolbarButtonProps) {
    const tooltipMessage = useMessage(tooltip)
    return (
        <button
            title={tooltipMessage}
            id={id}
            className={`toolbar-button ${id}-button`}
            onClick={onClick}
        >
            <span className={`glyphicon glyphicon-${icon}`}></span>
        </button>
    )
}
