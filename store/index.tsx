import { enableStaticRendering, useLocalObservable } from "mobx-react-lite"
import { createContext, PropsWithChildren, useContext } from "react"
import createStore, { IInitiavlVal } from "./rootStore"
import userStore from "./userStore."


enableStaticRendering(!process.browser)

const StoreContext = createContext<IInitiavlVal>({
    user: userStore()
})

export const StoreProvider = ({ initialValue, children }: PropsWithChildren & { initialValue: IInitiavlVal }) => {
    const store = useLocalObservable(createStore(initialValue))
    return (
        <StoreContext.Provider value={ store }>
            {children}
        </StoreContext.Provider>
    )
}

export function useStore () {
    const store = useContext(StoreContext)
    if (!store) {
        throw new Error('store 不存在')
    }
    return store
}