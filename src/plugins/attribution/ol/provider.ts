import { AttributionProvider } from "../../attribution"
import Attribution from "ol/control/Attribution"

const OLAttributionProvider: AttributionProvider = {
    create: function (map) {
        const control = new Attribution({
            target: document.querySelector(
                ".mapstore-attribution"
            ) as HTMLElement,
        })
        map.addControl(control)
        return {
            control,
            remove: () => {
                if (control) map.removeControl(control)
            },
        }
    },
}

export default OLAttributionProvider
