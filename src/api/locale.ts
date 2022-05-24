import { createContext } from "preact"
import { useContext, useEffect, useState } from "preact/hooks"

const baseUrl = `${import.meta.env.VITE_BACKEND}/translations`

export type LocaleMessages = {
    [key: string]: string | LocaleMessages
}

export const Locale = createContext<Locale | undefined>(undefined)

export type Locale = {
    locale: string
    messages: LocaleMessages
}

export function useLocale(userLocale?: string) {
    return (
        userLocale ||
        new URL(window.location.href).searchParams.get("locale") ||
        navigator.language
    )
}

export function useLocalizedMessages(userLocale?: string) {
    const locale = useLocale(userLocale)
    const [messages, setMessages] = useState<Locale | null>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        loadLocale(locale)
            .then(setMessages)
            .catch((e) => setError(e.message ?? "Unknown error"))
    }, [])

    return { locale, messages, error }
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
