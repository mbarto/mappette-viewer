import { Attribute, Category, MapConfig, MappettePlugin } from "./context-types"

export type MappetteDomainResource = {
    id: number
    name: string
    category: Category
    description?: string
    creation: string
    lastUpdate?: string
    metadata?: string
    data: string
    attributes: Attribute[]
}

export type DomainContext = {
    windowTitle?: string
    mapConfig: MapConfig
    plugins: MappettePlugin[]
}
