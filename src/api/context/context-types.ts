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

export type MappetteResource = {
    Resource: {
        id: number
        name: string | number
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

export type MappettePlugin = {
    name: string
    cfg?: unknown
    override?: unknown
}

export type MappettePluginDef = string | MappettePlugin

export type Context = {
    windowTitle?: string
    mapConfig: MapConfig
    customVariablesEnabled: boolean
    plugins: {
        [key: string]: MappettePluginDef[]
    }
    userPlugins: MappettePluginDef[]
}
