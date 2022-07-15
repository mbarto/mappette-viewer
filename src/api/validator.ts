export type ValidatorOptions = {
    instancePath: string
    parentData: unknown
    parentDataProperty: unknown
    rootData: unknown
}

export type ValidationError = {
    instancePath: string
    keyword: string
    message: string
    schemaPath: string
}

export type ValidatorFunction = {
    (data: unknown, options?: ValidatorOptions): Boolean
    errors?: ValidationError[]
}
