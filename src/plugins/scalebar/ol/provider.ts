import { ScalebarProvider } from "../../scalebar"
import ScaleLine from "ol/control/ScaleLine"

const OLScalebarProvider: ScalebarProvider = {
    create: function (map) {
        const control = new ScaleLine({
            target: document.querySelector(".mapstore-scalebar") as HTMLElement,
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

export default OLScalebarProvider
