import { useEffect, useReducer, useState } from "preact/hooks"
import type { Context } from "../api/context"
import { Map, MapInstance } from "../core/map"
import MapViewer from "../plugins/map"
import "./printer.css"
import Box, { CSSProperties, Rectangle } from "./box"
import Toolbar from "./toolbar"
import ScaleBox from "../plugins/scalebox"

type ContextPrinterProps = {
    context: Context
}

type PageComponent = {
    type: string
    id: string
    box: Rectangle
    stylable?: boolean
    style?: CSSProperties
}

type Page = {
    id: number
    components: PageComponent[]
}

type Orientation = "portrait" | "landscape"
type Sheet = "A4" | "A3"
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
            id: "title",
            box: {
                top: "5%",
                left: "5%",
                width: "90%",
                height: "20px",
            },
        },
        {
            type: "map",
            id: "map",
            box: {
                top: "100px",
                left: "5%",
                width: "90%",
                height: "50%",
            },
        },
        {
            type: "scale",
            id: "scale",
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
          type: "removePage"
          page: Page
      }
    | {
          type: "addComponent"
          component: PageComponent
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
        case "removePage":
            return {
                ...state,
                pages: state.pages.filter((p) => p.id !== action.page.id),
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
                    state.orientation === "portrait" ? "portrait" : "landscape",
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

    function addPage() {
        dispatch({
            type: "addPage",
        })
    }
    function removePage(page: Page) {
        dispatch({
            type: "removePage",
            page,
        })
    }
    function removeSelectedPage() {
        if (selectedPage > 0) {
            dispatch({
                type: "removeSelectedPage",
            })
        }
    }
    function addComponent(type: string) {
        const newComponent: PageComponent = {
            id: type,
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

    function renderComponent(component: PageComponent) {
        const pluginsProps = {
            setMap,
            context,
            mapType: "ol",
            plugins: [],
            allPlugins: [],
            cfg: {},
        }
        if (component.type === "map") return <MapViewer {...pluginsProps} />
        if (component.type === "text")
            return <div contentEditable>{context.windowTitle || "Title"}</div>
        if (component.type === "scale") return <ScaleBox {...pluginsProps} />
        return null
    }

    useEffect(() => {
        document.body.classList.remove("portrait")
        document.body.classList.remove("landscape")
        document.body.classList.add(orientation)

        document.body.classList.remove("A4")
        document.body.classList.remove("A3")
        document.body.classList.add(sheet)

        const style = document.getElementById("page-style")
        if (style) document.head.removeChild(style)

        const pageStyle = document.createElement("style")
        pageStyle.id = "page-style"
        pageStyle.setAttribute("type", "text/css")
        pageStyle.appendChild(
            document.createTextNode(
                `@page {margin: 0; size: ${sheet} ${orientation}}`
            )
        )
        document.head.appendChild(pageStyle)
    }, [orientation, sheet])

    function applyStyleToComponent(style: CSSProperties) {
        if (selectedComponent) {
            dispatch({
                type: "applyStyle",
                style,
            })
        }
    }
    return (
        <Map.Provider value={map}>
            <Toolbar
                addPage={addPage}
                removePage={removeSelectedPage}
                addComponent={addComponent}
                orientation={orientation}
                sheet={sheet}
                toggleOrientation={toggleOrientation}
                toggleSheet={toggleSheet}
                selectedPage={selectedPage}
                applyStyle={applyStyleToComponent}
            />
            {pages.map((page, idx) => (
                <div
                    style={{}}
                    className={`sheet ${
                        selectedPage === idx ? "selected" : ""
                    }`}
                    onClick={(e) => {
                        if (e.target instanceof HTMLDivElement) {
                            if (!e.target.closest(".box")) selectComponent(null)
                        }
                        selectPage(idx)
                    }}
                >
                    {idx > 0 && (
                        <div
                            className="remove"
                            onClick={() => removePage(page)}
                        >
                            X
                        </div>
                    )}
                    {page.components.map((c) => (
                        <Box
                            id={c.id}
                            rect={c.box}
                            stylable={c.stylable}
                            boxStyle={c.style}
                            selected={c.id === selectedComponent}
                            onSelect={selectComponent}
                        >
                            {renderComponent(c)}
                        </Box>
                    ))}
                </div>
            ))}
        </Map.Provider>
    )
}
