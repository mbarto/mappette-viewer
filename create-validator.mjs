import Ajv from "ajv"
import { readFile, writeFile } from "fs/promises"
import standaloneCode from "ajv/dist/standalone/index.js"

function compileSchema(schema) {
    const ajv = new Ajv({
        schemas: [schema],
        allowUnionTypes: true,
        code: { source: true, esm: true, lines: true },
    })
    return standaloneCode(ajv, {
        Validator: schema["$id"],
    })
}

function withId(json, id) {
    return {
        $id: id,
        ...json,
    }
}

function writeOutputFiles(outputFile, code, type) {
    return Promise.all([
        writeFile(outputFile + ".js", code),
        writeFile(
            outputFile + ".d.ts",
            `import { ValidatorFunction } from "./validator"
import { ${type} } from "./context-types"
export const Validator: ValidatorFunction<${type}>`
        ),
    ])
}

if (process.argv.length >= 6) {
    const id = process.argv[2]
    const inputFile = process.argv[3]
    const outputFile = process.argv[4]
    const type = process.argv[5]
    readFile(inputFile)
        .then((txt) => compileSchema(withId(JSON.parse(txt), id)))
        .then((code) => writeOutputFiles(outputFile, code, type))
        .then(() => console.log("Validator created successfully!"))
        .catch((e) => console.error(e))
} else {
    console.log("create-validator <id> <json-schema> <validator-js>")
    process.exit(1)
}
