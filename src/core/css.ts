import { Inputs, useEffect } from "preact/hooks"

export function useLayout(
    property: string,
    value: string | number | (() => string) | (() => number),
    dependencies: Inputs | undefined
): void {
    useEffect(() => {
        if (!CSS.supports("selector(*:has(*))")) {
            const css = document.querySelector(":root") as HTMLElement
            if (css) {
                css.style.setProperty(
                    `--${property}`,
                    (typeof value === "function" ? value() : value).toString()
                )
            }
        }
    }, dependencies)
}
