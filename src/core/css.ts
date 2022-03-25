import { Inputs, useEffect } from "preact/hooks"

export function useCssVariable(
    property: string,
    updater: () => string,
    dependencies: Inputs | undefined
): void {
    useEffect(() => {
        const css = document.querySelector(":root") as HTMLElement
        if (css) {
            css.style.setProperty(property, updater())
        }
    }, dependencies)
}
