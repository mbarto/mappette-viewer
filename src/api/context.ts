import { useEffect, useState } from "preact/hooks"
import { Context, MappetteResource } from "./context-types"
import { Validator as resourceValidator } from "./resource.validator"
import { Validator as contextValidator } from "./context.validator"
import { ValidationError } from "./validator"

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
        .then((resource: MappetteResource) => {
            if (resourceValidator(resource)) {
                const context = JSON.parse(resource.Resource.data.data)
                if (contextValidator(context)) return context as Context
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

    const [context, setContext] = useState<Context | null>(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        loadContext(contextName, local)
            .then(setContext)
            .catch((e) => setError(e?.message || "Unknown error"))
    }, [])
    return { context, error, mode }
}
