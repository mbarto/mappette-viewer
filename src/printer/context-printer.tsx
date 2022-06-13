import { useEffect, useReducer, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { Map, MapInstance } from "../core/map"
import "./printer.css"
import { CSSProperties, mergeStyle } from "./box"
import Toolbar from "./toolbar"
import PrintedPage, {
    Orientation,
    Sheet,
    usePage,
    Page,
    PageComponent,
    OptionalPageComponentProperties,
    defaultComponentProperties,
    ComponentTypes,
} from "./page"
import Thumbnails from "./thumbnails"

type ContextPrinterProps = {
    context: Context
}

type PrinterState = {
    selectedPage: number
    selectedComponent: string | null
    orientation: Orientation
    sheet: Sheet
    pages: Page[]
    zoom: number
}

let currentId = 1

const initialPage: Page = {
    id: 0,
    components: [
        {
            type: "text",
            id: "title-0",
            box: {
                top: "5%",
                left: "5%",
                width: "90%",
                height: "20px",
            },
            stylable: true,
        },
        {
            type: "map",
            id: "map-0",
            box: {
                top: "100px",
                left: "5%",
                width: "90%",
                height: "50%",
            },
            lockable: true,
            locked: true,
        },
        {
            type: "scale",
            id: "scale-0",
            box: {
                top: "90%",
                left: "5%",
                width: "30%",
                height: "30px",
            },
            stylable: true,
        },
    ],
}

type PrinterAction =
    | {
          type: "addPage"
      }
    | {
          type: "removeSelectedPage"
      }
    | {
          type: "addComponent"
          component: PageComponent
      }
    | {
          type: "removeSelectedComponent"
      }
    | {
          type: "toggleOrientation"
      }
    | {
          type: "toggleSheet"
      }
    | {
          type: "selectComponent"
          component: string | null
      }
    | {
          type: "selectPage"
          page: number
      }
    | {
          type: "applyStyle"
          style: CSSProperties
      }
    | {
          type: "zoomIn"
      }
    | {
          type: "zoomOut"
      }

export const MAX_ZOOM = 1
export const MIN_ZOOM = 0.125

function reducer(state: PrinterState, action: PrinterAction): PrinterState {
    switch (action.type) {
        case "addPage":
            return {
                ...state,
                pages: [...state.pages, { id: currentId++, components: [] }],
            }
        case "removeSelectedPage":
            return {
                ...state,
                pages: state.pages.filter((_, i) => i !== state.selectedPage),
            }
        case "removeSelectedComponent":
            return {
                ...state,
                pages: state.pages.map((p) => ({
                    ...p,
                    components: p.components.filter(
                        (c) => c.id !== state.selectedComponent
                    ),
                })),
            }
        case "addComponent":
            return {
                ...state,
                pages: state.pages.map((p, i) =>
                    i === state.selectedPage
                        ? {
                              ...p,
                              components: [...p.components, action.component],
                          }
                        : p
                ),
            }
        case "toggleOrientation":
            return {
                ...state,
                orientation:
                    state.orientation === "portrait" ? "landscape" : "portrait",
            }
        case "toggleSheet":
            return {
                ...state,
                sheet: state.sheet === "A4" ? "A3" : "A4",
            }
        case "selectComponent":
            return {
                ...state,
                selectedComponent: action.component,
            }
        case "selectPage":
            return {
                ...state,
                selectedPage: action.page,
            }
        case "applyStyle":
            return {
                ...state,
                pages: state.pages.map((p, i) =>
                    i === state.selectedPage
                        ? {
                              ...p,
                              components: p.components.map((c) =>
                                  c.id === state.selectedComponent
                                      ? {
                                            ...c,
                                            style: mergeStyle(
                                                c.style ?? {},
                                                action.style
                                            ),
                                        }
                                      : c
                              ),
                          }
                        : p
                ),
            }
        case "zoomIn": {
            return {
                ...state,
                zoom: state.zoom === MAX_ZOOM ? state.zoom : state.zoom * 2,
            }
        }
        case "zoomOut": {
            return {
                ...state,
                zoom: state.zoom === MIN_ZOOM ? state.zoom : state.zoom / 2,
            }
        }
    }
}

function getPageDimensions(pageNumber: number) {
    const page = document
        .getElementsByClassName("sheet")
        .item(pageNumber) as HTMLDivElement
    if (page) {
        return {
            page,
            rect: page.getBoundingClientRect(),
            width: page.offsetWidth,
            height: page.offsetHeight,
        }
    }
    return null
}

function isInViewport(rect: DOMRect, width: number, height: number): boolean {
    return (
        rect.top >= -height &&
        rect.left >= -width &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth) +
                width &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) +
                height
    )
}

function scrollToPage(page: HTMLDivElement) {
    page.scrollIntoView()
}

let componentId = 1

export default function ContextPrinter({ context }: ContextPrinterProps) {
    const [map, setMap] = useState<MapInstance | null>(null)
    const [state, dispatch] = useReducer<PrinterState, PrinterAction>(reducer, {
        selectedPage: 0,
        selectedComponent: null,
        orientation: "portrait",
        sheet: "A4",
        pages: [initialPage],
        zoom: 1,
    })
    const { selectedPage, selectedComponent, pages, orientation, sheet, zoom } =
        state
    usePage(orientation, sheet, zoom)
    useEffect(() => {
        const dimensions = getPageDimensions(selectedPage)
        if (
            dimensions &&
            !isInViewport(dimensions.rect, dimensions.width, dimensions.height)
        )
            scrollToPage(dimensions.page)
    }, [selectedPage])

    function addPage() {
        dispatch({
            type: "addPage",
        })
    }
    function removeSelectedPage() {
        if (selectedPage > 0) {
            dispatch({
                type: "removeSelectedPage",
            })
        }
    }
    function removeSelectedComponent() {
        if (selectedComponent) {
            dispatch({
                type: "removeSelectedComponent",
            })
        }
    }
    function addComponent(type: ComponentTypes) {
        const newComponent: PageComponent = {
            id: `${type}-${componentId++}`,
            type,
            box: {
                left: "0",
                top: "50px",
                width: "100%",
                height: "20px",
            },
            ...(defaultComponentProperties[type] ?? {}),
        }
        dispatch({
            type: "addComponent",
            component: newComponent,
        })
    }

    function toggleOrientation() {
        dispatch({
            type: "toggleOrientation",
        })
    }

    function toggleSheet() {
        dispatch({
            type: "toggleSheet",
        })
    }

    function selectPage(page: number) {
        dispatch({
            type: "selectPage",
            page,
        })
    }

    function selectComponent(component: string | null) {
        dispatch({
            type: "selectComponent",
            component,
        })
    }

    function applyStyleToComponent(style: CSSProperties) {
        if (selectedComponent) {
            dispatch({
                type: "applyStyle",
                style,
            })
        }
    }
    function print() {
        window.print()
    }
    function zoomIn() {
        dispatch({
            type: "zoomIn",
        })
    }
    function zoomOut() {
        dispatch({
            type: "zoomOut",
        })
    }
    return (
        <Map.Provider value={map}>
            <Toolbar
                addPage={addPage}
                removePage={removeSelectedPage}
                addComponent={addComponent}
                removeComponent={removeSelectedComponent}
                orientation={orientation}
                sheet={sheet}
                zoom={zoom}
                toggleOrientation={toggleOrientation}
                toggleSheet={toggleSheet}
                selectedPage={selectedPage}
                applyStyle={applyStyleToComponent}
                print={print}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
            />
            {pages.map((page, idx) => (
                <PrintedPage
                    context={context}
                    isSelected={idx === selectedPage}
                    onSelectComponent={selectComponent}
                    onSelectPage={() => selectPage(idx)}
                    page={page}
                    selectedComponent={selectedComponent}
                    setMap={setMap}
                    zoom={zoom}
                />
            ))}
            <Thumbnails
                pages={pages}
                selectedPage={selectedPage}
                onSelect={selectPage}
            />
        </Map.Provider>
    )
}
