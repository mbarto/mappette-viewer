import { useEffect, useState } from "preact/hooks"
import {
    Attribute,
    Context,
    MappettePlugin,
    MappettePluginDef,
    MappetteResource,
} from "./context-types"
import { Validator as resourceValidator } from "./resource.validator"
import { Validator as contextValidator } from "./context.validator"
import { ValidationError } from "./validator"
import { DomainContext, MappetteDomainResource } from "./context-domain-types"

const baseUrl = `${import.meta.env.VITE_BACKEND}/rest/geostore`
const contextEndpoint = "misc/category/name/CONTEXT/resource/name"

function buildError(prefix: string, errors?: ValidationError[]): string {
    if (errors)
        return (
            prefix +
            errors.map((e) => `${e.instancePath}: ${e.message}`).join("\n")
        )
    return prefix
}

function buildAttributes(
    attributes: MappetteResource["Resource"]["Attributes"]
): Attribute[] {
    if (attributes === "") return []
    if (attributes instanceof Array) return attributes
    return [attributes]
}

function buildResource(resource: MappetteResource): MappetteDomainResource {
    const innerResource = resource.Resource
    return {
        id: innerResource.id,
        name: innerResource.name.toString(),
        description: innerResource.description,
        category: innerResource.category,
        creation: innerResource.creation,
        lastUpdate: innerResource.lastUpdate,
        metadata: innerResource.metadata,
        data: innerResource.data.data,
        attributes: buildAttributes(innerResource.Attributes),
    }
}

function buildPlugin(plugin: MappettePluginDef): MappettePlugin {
    if (typeof plugin === "string") {
        return {
            name: plugin,
        }
    }
    return plugin
}

function buildContext(context: Context): DomainContext {
    return {
        mapConfig: context.mapConfig,
        windowTitle: context.windowTitle,
        plugins: context.plugins["desktop"].map(buildPlugin),
    }
}

export function loadContext(
    contextName: string,
    local: boolean
): Promise<DomainContext> {
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
        .then((resource: unknown) => {
            if (resourceValidator(resource)) {
                const domainResource = buildResource(resource)
                const context = JSON.parse(domainResource.data) as unknown
                if (contextValidator(context)) return buildContext(context)
                throw new Error(
                    buildError(
                        "Error parsing Context: ",
                        contextValidator.errors
                    )
                )
            }
            throw new Error(
                buildError("Error parsing Resource: ", resourceValidator.errors)
            )
        })
}

export function useContext() {
    const url = new URL(window.location.href)
    const contextName = url.searchParams.get("context") ?? "config.json"
    const local = contextName === "config.json"
    const mode = url.searchParams.get("mode") ?? "2d"

    const [context, setContext] = useState<DomainContext | null>(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        loadContext(contextName, local)
            .then(setContext)
            .catch((e) => setError(e?.message || "Unknown error"))
    }, [])
    return { context, error, mode }
}
