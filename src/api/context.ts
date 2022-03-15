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

export type MapLayer = {
    id: string
    name: string
    type: string
    source?: string
    group?: string
    visibility: boolean
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
    }
}

export type MapStorePlugin = {}

export type Context = {
    windowTitle?: string
    mapConfig: MapConfig
    customVariablesEnabled: boolean
    plugins: {
        [key: string]: MapStorePlugin[]
    }
    userPlugins: MapStorePlugin[]
}

export function loadContext(contextName: string): Promise<Context> {
    return fetch(`${baseUrl}/${contextEndpoint}/${contextName}`, {
        headers: {
            Accept: "application/json",
        },
    })
        .then((resp) => resp.json())
        .then((resource: MapStoreResource) => {
            return JSON.parse(resource.Resource.data.data) as Context
        })
}
