import { useEffect, useState } from "preact/hooks"

const baseUrl =
    "https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore"
const contextEndpoint = "misc/category/name/CONTEXT/resource/name"

export type Category = {
    id: number
    name: string
}

export type Attribute = {
    attribute: {
        name: string
        value: string | number
        "@type": string
    }
}

export type MapStoreResource = {
    Resource: {
        id: number
        name: string
        category: Category
        description?: string
        creation: string
        lastUpdate?: string
        metadata?: string
        data: {
            data: string
        }
        Attributes: "" | Attribute | Attribute[]
    }
}

export type MapLayerGroup = {
    id: string
    title: string
    expanded: boolean
}

export type MapLayer = {
    id: string
    name: string
    title?:
        | {
              [key: string]: string
          }
        | string
    type: string
    source?: string
    group?: string
    visibility: boolean
    opacity?: number
}

export type MapSources = {
    [key: string]: unknown
}

export type MapConfig = {
    version: number
    map: {
        center: {
            x: number
            y: number
            crs: string
        }
        zoom: number
        maxExtent?: [minX: number, minY: number, maxX: number, maxY: number]
        projection?: string
        mapOptions: {
            [key: string]: string | number
        }
        layers: MapLayer[]
        groups: MapLayerGroup[]
        sources: MapSources | undefined
    }
}

export type MapStorePlugin = {
    name: string
    cfg?: unknown
    override?: unknown
}

export type MapStorePluginDef = string | MapStorePlugin

export type Context = {
    windowTitle?: string
    mapConfig: MapConfig
    customVariablesEnabled: boolean
    plugins: {
        [key: string]: MapStorePluginDef[]
    }
    userPlugins: MapStorePluginDef[]
}

export function loadContext(
    contextName: string,
    local: boolean
): Promise<Context> {
    const url = local
        ? contextName
        : `${baseUrl}/${contextEndpoint}/${contextName}`
    return fetch(url, {
        headers: {
            Accept: "application/json",
        },
    })
        .then((resp) => {
            if (resp.ok) return resp.json()
            return resp.text().then((t) => {
                throw new Error(`Error loading ${contextName}: ${t}`)
            })
        })
        .then((resource: MapStoreResource) => {
            return JSON.parse(resource.Resource.data.data) as Context
        })
}

export function useContext() {
    const url = new URL(window.location.href)
    const contextName = url.searchParams.get("context") ?? "config.json"
    const local = contextName === "config.json"
    const mode = url.searchParams.get("mode") ?? "2d"

    const [context, setContext] = useState<Context | null>(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        loadContext(contextName, local)
            .then(setContext)
            .catch((e) => setError(e?.message || "Unknown error"))
    })
    return { context, error, mode }
}
