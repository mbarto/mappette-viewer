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

export type ValidatorFunction<T> = {
    (data: unknown, options?: ValidatorOptions): data is T
    errors?: ValidationError[]
}
