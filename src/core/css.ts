import { Inputs, useEffect } from "preact/hooks"

export function useLayout(
    property: string,
    value: string | (() => string),
    dependencies: Inputs | undefined
): void {
    useEffect(() => {
        const css = document.querySelector(":root") as HTMLElement
        if (css) {
            css.style.setProperty(
                `--${property}`,
                typeof value === "function" ? value() : value
            )
        }
    }, dependencies)
}
