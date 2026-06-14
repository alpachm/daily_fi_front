import { createContext, useContext, type ReactNode, type Dispatch } from "react";

interface IAppContext {}

interface AppProviderProps {
    children: ReactNode;
}

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = (props: AppProviderProps) => {
    const value = {};

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
