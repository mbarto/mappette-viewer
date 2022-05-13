import { useEffect, useReducer, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { Map, MapInstance } from "../core/map"
import "./printer.css"
import { CSSProperties, Rectangle } from "./box"
import Toolbar from "./toolbar"
import PrintedPage, {
    Orientation,
    Sheet,
    usePage,
    Page,
    PageComponent,
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
                                            style: action.style,
                                        }
                                      : c
                              ),
                          }
                        : p
                ),
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

function isInVieweport(rect: DOMRect, width: number, height: number): boolean {
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
    })
    const { selectedPage, selectedComponent, pages, orientation, sheet } = state
    usePage(orientation, sheet)
    useEffect(() => {
        const dimensions = getPageDimensions(selectedPage)
        if (
            dimensions &&
            !isInVieweport(dimensions.rect, dimensions.width, dimensions.height)
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
    function addComponent(type: string) {
        const newComponent: PageComponent = {
            id: `${type}-${componentId++}`,
            type,
            box: {
                left: "0",
                top: "50px",
                width: "100%",
                height: "20px",
            },
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
    return (
        <Map.Provider value={map}>
            <Toolbar
                addPage={addPage}
                removePage={removeSelectedPage}
                addComponent={addComponent}
                removeComponent={removeSelectedComponent}
                orientation={orientation}
                sheet={sheet}
                toggleOrientation={toggleOrientation}
                toggleSheet={toggleSheet}
                selectedPage={selectedPage}
                applyStyle={applyStyleToComponent}
                print={print}
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
