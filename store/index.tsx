import { enableStaticRendering, useLocalObservable } from "mobx-react-lite";
import { createContext, PropsWithChildren, useContext } from "react";
import createStore, { IInitivalVal } from "./rootStore";

enableStaticRendering(!process.browser);

const StoreContext = createContext<IInitivalVal>({});

export const StoreProvider = ({
  initialValue,
  children,
}: PropsWithChildren & { initialValue: IInitivalVal }) => {
  console.log(initialValue, "initialValue---StoreProvider");
  const store = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("store 不存在");
  }
  return store;
}
