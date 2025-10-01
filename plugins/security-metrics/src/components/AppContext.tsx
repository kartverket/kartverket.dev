import { createContext } from "react"

interface AppContextProps {
    isUsingNewFeature: boolean
    setIsUsingNewFeature: (value: boolean) => void
}

const defaultContextValue: AppContextProps = {
    isUsingNewFeature: false,
    setIsUsingNewFeature: () => {},
}

export const AppContext = createContext<AppContextProps>(defaultContextValue)
