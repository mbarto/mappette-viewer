import fetch from "node-fetch"
import Ajv from "ajv"
import { readFileSync } from "fs"

const ajv = new Ajv({ allowUnionTypes: true })
const resource = JSON.parse(readFileSync("./src/api/resource.schema.json"))
const resourceValidator = ajv.compile(resource)
const context = JSON.parse(readFileSync("./src/api/context.schema.json"))
const contextValidator = ajv.compile(context)

function validateContext(context) {
    const valid = contextValidator(resource)
    if (valid) {
        console.log("Context successfully validated!")
    } else console.error(contextValidator.errors)
}

function validateResource(resource) {
    const valid = resourceValidator(resource)
    if (valid) {
        console.log("Resource successfully validated!")
        validateContext(resource.Resource.data.data)
    } else console.error(resourceValidator.errors)
}

if (process.argv.length >= 3) {
    const url = process.argv[2]
    fetch(url, {
        headers: {
            Accept: "application/json",
        },
    })
        .then((resp) => resp.json())
        .then(validateResource)
        .catch((e) => console.error(e.message))
} else {
    console.log("validate-context <context-url>")
    process.exit(1)
}
