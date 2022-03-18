import { createContext } from "preact"
import { useContext } from "preact/hooks"

const baseUrl =
    "https://dev-mapstore.geosolutionsgroup.com/mapstore/translations"

export type LocaleMessages = {
    [key: string]: string | LocaleMessages
}

export const Locale = createContext<Locale | undefined>(undefined)

export type Locale = {
    locale: string
    messages: LocaleMessages
}

export function loadLocale(
    locale: string = navigator.language
): Promise<Locale> {
    return fetch(`${baseUrl}/data.${locale}.json`).then((resp) => resp.json())
}

export function getMessage(
    locale: Locale | undefined,
    path: string,
    defaultValue: string = path
): string {
    if (locale?.messages) {
        const value = path
            .split(".")
            .reduce<LocaleMessages | string | undefined>(
                (res, prop) =>
                    typeof res === "string" ? undefined : res?.[prop],
                locale.messages
            )
        return typeof value === "string" ? value : defaultValue
    }
    return defaultValue
}

export function useMessage(message: string, defaultValue: string = message) {
    const locale = useContext(Locale)
    return getMessage(locale, message, defaultValue)
}
